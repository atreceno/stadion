'use strict';

var helper = angular.module('helper', []);

helper.factory('Duel', function () {

/*
 * interlude.js
 */
var interlude = {
    odd: function (n) {
        return n % 2 === 1;
    },
    firstBy: function (fn, xs) {
        for (var i = 0, len = xs.length; i < len; i += 1) {
            if (fn(xs[i])) {
                return xs[i];
            }
        }
    },
    maximum: {},
    flatten: function (xs) {
        return concat.apply([], xs);
    },
    pluck: function (prop, xs) {
        var result = [];
        for (var i = 0, len = xs.length; i < len; i += 1) {
            result[i] = xs[i][prop];
        }
        return result;    
    },
    get: function () {
        var args = arguments;
        return function (el) {
            var res = el;
            for (var i = 0; i < args.length && res !== undefined; i += 1) {
                res = res[args[i]];
            }
            return res;
        };
    }
};

/*
 * public.js
 */
var T = {
  WO : -1,  // bye/walk-over marker (duel/balancer)
  NA : 0,   // player not ready marker (ffa/duel/knockout)
  // brackets: duel only (for now.. crossovers could change that)
  // Bracket numbers are locked down for the the following logical equivalence:
  // numBrackets === n <=> lastBracket === n <=> n-tuple elimination
  WB : 1,
  LB : 2,
  TB : 3
};

// matches are stored in a sorted array rather than an ID -> Match map
// This is because ordering is more important than being able to access any match
// at any time. Looping to find the one is also quick because ms is generally short.
T.findMatch = function (ms, id) {
  for (var i = 0; i < ms.length; i += 1) {
    var m = ms[i];
    if (m.id.s === id.s && m.id.r === id.r && m.id.m === id.m) {
      return m;
    }
  }
};

/*
 * common.js
 */
// to ensure first matches first and (for most part) forEach scorability
// score section desc, else round desc, else match number desc
// similarly how it's read in many cases: WB R2 G3
T.compareMatches = function (g1, g2) {
  return (g1.id.s - g2.id.s) || (g1.id.r - g2.id.r) || (g1.id.m - g2.id.m);
};

// internal sorting of zipped player array with map score array : zip(g.p, g.m)
// sorts by map score desc, then seed asc
T.compareZip = function (z1, z2) {
  return (z2[1] - z1[1]) || (z1[0] - z2[0]);
};

// how to sort results array (of objects) : by position desc (or seed asc for looks)
// only for sorting (more advanced `pos` algorithms may be used separately)
T.compareRes = function (r1, r2) {
  return (r1.pos - r2.pos) || (r1.seed - r2.seed);
};

/*
 * duel_names.js
 */
/**
 * roundNames UI helper function for Duel tournaments - localized to English
 *
 * It's possible to allow full localization, but it would require more work.
 * In particular, rounds like 'Round of 8/16' is called '8ths/16ths Finals' in other
 * countries, whereas we just hard coded them as string + Math.pow(2, x).
 *
 * It is therefore possible this should be moved out of tournament and be mixed in
 * by the user of- rather than the module itself given the customizations needed.
 * Sensible defaults is the only reason for keeping it inside tournament.
 */

var seNames = [
  "Bronze final", // bronze final match is sometimes parts of the 'finals' round
  "Grand final",  // often called just the 'Final'
  "Semi-finals",
  "Quarter-finals",
  "Round of "
];

// when in double elimination we use these 2
var wbNames = [
  "WB Final",
  "WB Semi-finals",
  "WB Quarter-finals",
  "WB Round of "
];
var lbNames = [
  "Grand final",          // Strong grand final - but spoiler by prefixing Strong
  "Grand final",          // Potentially last game
  "LB Strong final",      // 3rd place decider
  "LB Final",             // 4th place decider
  "LB Round of ",         // first time there's X in LB
  "LB Strong round of "   // last time there's X in LB
];

// can take a partial id where everything but the match number is left out
// passed in T is a limited object that gets passed in via the in-mixer
var roundName = function (T, last, p, partialId) {
  var br = partialId.s
    , r = partialId.r;

  // sanity
  if (!Number.isFinite(r) || r < 1 || [T.WB, T.LB].indexOf(br) < 0) {
    throw new Error("invalid partial id for roundName: " + partialId);
  }
  var invWB = (br === T.WB && r > p)
    , invSeLB = (last === T.WB && br >= T.LB && r !== 1)
    , invDeLB = (last === T.LB && r > 2*p);

  if (invWB || invSeLB || invDeLB) {
    var str = "br=" + br + ", last=" + last;
    throw new Error("invalid round number " + r + " given for elimination: " + str);
  }

  if (last === T.WB) {
    if (br === T.LB) {
      return seNames[0]; // already know it is not an invalid match
    }
    return (r > p - 3) ? seNames[p - r + 1] : seNames[4] + Math.pow(2, p - r + 1);
  }
  // otherwise double elim
  if (br === T.WB) {
    return (r > p - 3) ? wbNames[p - r] : wbNames[3] + Math.pow(2, p - r + 1);
  }
  if (br === T.LB) {
    if (r >= 2*p - 3) {
      return lbNames[2*p - r]; // grand final rounds or LB final
    }

    // Round of %d - where %d is num players left in LB
    if (r % 2 === 1) {
      return lbNames[4] + Math.pow(2, p-(r+1)/2);
    }
    // Mixed round of %d (always the same as the round before because of feeding)
    return lbNames[5] + Math.pow(2, p - r/2);
  }
};


/*
 * duel.js
 */
// Make easy access constants available  directly
var WB = T.WB
  , LB = T.LB
  , NA = T.NA
  , WO = T.WO;

// map last bracket num to elimination type
var brackets = [
  'invalid', // put this in here so the Array is aligned right
  'single',
  'double',
  'triple'   // not supported atm
];

// mark players that had to be added to fit model as WO's
var woMark = function (ps, size) {
  return ps.map(function (p) {
    return (p > size) ? WO : p;
  });
};

// shortcut to create a match id as duel tourneys are very specific about locations
var gId = function (b, r, m) {
  return {s: b, r: r, m: m};
};

var idString = function (id) {
  var rep = "";
  if (id.s === T.WB) {
    rep = "WB ";
  }
  else if (id.s === T.LB) {
    rep = "LB ";
  }
  // else assume no bracket identifier wanted
  return (rep + "R" + id.r + " M" + id.m);
};

// -----------------------------------------------------------------------------
// duel elimination stuff

// helpers to initialize duel tournaments
// http://clux.org/entries/view/2407
var evenSeed = function (i, p) {
  var k = Math.floor(Math.log(i) / Math.log(2))
    , r = i - Math.pow(2, k);
  if (r === 0) {
    return Math.pow(2, p - k);
  }
  var nr = (i - 2*r).toString(2).split('').reverse().join('');
  return (parseInt(nr, 2) << p - nr.length) + Math.pow(2, p - k - 1);
};

// get initial players for match i in a power p duel tournament
// NB: match number i is 1-indexed - VERY UNDEFINED for i<=0
var seeds = function (i, p) {
  var even = evenSeed(i, p);
  return [Math.pow(2, p) + 1 - even, even];
};

var makeFirstRounds = function (size, p, last) {
  var model = Math.pow(2, p) // model >= size (equals iff size is a power of 2)
    , matches = []
    , lbm1, lbm2, wbm2; // placeholders for LBR1, LBR2 & WBR2 (used in even itrs)

  for (var i = 1; i <= model / 2; i += 1) {
    var ps = woMark(seeds(i, p), size)
      , isEven = Number(i % 2 === 0)
      , wbm1 = {id: gId(WB, 1, i), p: ps};

    // create shells for WBR2, LBR1 & LBR2
    if (!isEven) {
      var next = (i+1) / 2;
      wbm2 = {id: gId(WB, 2, next), p: [NA, NA]};

      if (last >= LB) {
        lbm1 = {id: gId(LB, 1, next), p: [NA, NA]};
        lbm2 = {id: gId(LB, 2, next), p: [NA, NA]};
      }
    }

    if (ps[0] === WO || ps[1] === WO) {
      wbm2.p[isEven] = ps[Number(ps[0] === WO)]; // advance winner
      wbm1.m = (ps[0] === WO) ? [0, 1] : [1, 0]; // set WO score in wbm1

      if (last >= LB) {
        lbm1.p[isEven] = WO; // wo marker 'lost', so goes to LBR1
        if (lbm1.p[0] === WO && lbm1.p[1] === WO) {
          // NB: here in even itrs when we have rare 2x WO markers in an LBR1 match
          lbm2.p[Number(!isEven)] = WO; // pass it on (w/LBR2's inverse propagation)
          lbm1.m = [1, 0]; // randomly score one as the winner
        }
      }
    }

    matches.push(wbm1);
    // progressed shells pushed to matches every other iteration
    if (isEven) {
      matches.push(wbm2);
      if (last >= LB) {
        matches.push(lbm1, lbm2);
      }
    }
  }
  return matches;
};

var invalid = function (np, last, opts) {
  if (!Number.isFinite(np) || Math.ceil(np) !== np || np < 4 || np > 1024) {
    return "duel tournament size must be an integer n, s.t. 4 <= n <= 1024";
  }
  if ([WB, LB].indexOf(last) < 0) {
    return "last Duel elimination bracket must be t.WB or t.LB";
  }
  if (opts.limit) { // TODO: possible to do I guess..
    return "Duel limits are not yet supported - Duel must be the last stage";
  }
  return null;
};

// return an array of matches for a tournament
// a match has the form {p: playerArray, s: bracketNum, r: roundNum, m: matchNum}
// bracket, round and match number are 1 indexed
var elimination = function (size, p, last, isLong) {
  var invReason = invalid(size, last, {limit: 0, short: !isLong});
  if (invReason !== null) {
    console.error("invalid Duel configuration %dp in %s elimination"
      , size, brackets[last] || 'invalid');
    console.error("reason: ", invReason);
    return [];
  }

  // console.log('creating %dp %s elimination tournament', size, brackets[last]);
  // create round 1,2 in WB & LB
  var matches = makeFirstRounds(size, p, last);

  // remaining WB rounds (which never get WO markers from first fill-in)
  var r, g;
  for (r = 3; r <= p; r += 1) {
    for (g = 1; g <= Math.pow(2, p - r); g += 1) {
      matches.push({id: gId(WB, r, g), p: [NA, NA]});
    }
  }
  if (last === WB && isLong) {
    matches.push({id: gId(LB, 1, 1), p: [NA, NA]});       // bronze final
  }

  if (last >= LB) {
    for (r = 3; r <= 2*p - 2; r += 1) {
      // number of matches halves every odd round in losers bracket
      for (g = 1; g <= Math.pow(2, p - 1 - Math.floor((r + 1) / 2)); g += 1) {
        matches.push({id: gId(LB, r, g), p: [NA, NA]});
      }
    }

    matches.push({id: gId(LB, 2*p - 1, 1), p: [NA, NA]}); // grand final match 1
    if (isLong) {
      matches.push({id: gId(LB, 2*p, 1), p: [NA, NA]});   // grand final match 2
    }
  }
  return matches.sort(T.compareMatches); // sort so they can be scored in order
};

// progression helpers, winner in `id` goes right to returned id or tournament over
var progressRight = function (id, underdogWon) {
  var b = id.s
    , r = id.r
    , g = id.m
    , p = this.p
    , last = this.last
    , isLong = this.isLong;

  // cases where progression stops for winners
  var isFinalSe = (last === WB && r === p)
    , isFinalDe = (last === LB && b === LB && r === 2*p)
    , isBronze = (last === WB && b === LB)
    , isShortLbGf = (b === LB && r === 2*p - 1 && (!isLong || !underdogWon));

  if (isFinalSe || isFinalDe || isBronze || isShortLbGf) {
    return null;
  }

  // special case of WB winner moving to LB GF G1
  if (last >= LB && b === WB && r === p) {
    return [gId(LB, 2*p - 1, 1), 0];
  }

  // for LB positioning
  var ghalf = (b === LB && interlude.odd(r)) ? g : Math.floor((g + 1) / 2);

  var pos;
  if (b === WB) {
    pos = (g + 1) % 2; // normal WB progression
  }
  else if (r === 2*p - 2) {
    pos = 1; // LB final winner => bottom of GF
  }
  else if (r === 2*p - 1) {
    pos = 0; // GF(1) winner moves to the top
  }
  else if (r === 1) {
    pos = g % 2; // LBR1 winners move inversely to normal progression
  }
  else if (interlude.odd(r)) {
    pos = 1; // winner usually takes bottom position in LB
  }
  else {
    pos = (g + 1) % 2; // normal progression only in even rounds
  }

  // normal progression
  return [gId(b, r + 1, ghalf), pos];
};

var progressDown = function (id, underdogWon) {
  var b = id.s
    , r = id.r
    , g = id.m
    , p = this.p
    , last = this.last
    , isLong = this.isLong;

  // knockouts / special finals
  if (b >= last) { // greater than case is for BF in long single elimination
    if (b === WB && isLong && r === p - 1) {
      // if bronze final, move loser to "LBR1" at mirror pos of WBGF
      return [gId(LB, 1, 1), (g + 1) % 2];
    }
    if (b === LB && r === 2*p - 1 && isLong && underdogWon) {
      // if double final, then loser moves to the bottom
      return [gId(LB, 2 * p, 1), 1];
    }
    // otherwise always KO'd if loosing in >= last bracket
    return null;
  }

  // LB drops: on top for (r>2) and (r<=2 if odd g) to match bracket movement
  var pos = (r > 2 || interlude.odd(g)) ? 0 : 1;
  // LBR1 only fed by WBR1 (halves normally), else feed -> r=2x later (w/matching g)
  var dId = (r === 1) ? gId(LB, 1, Math.floor((g+1)/2)) : gId(LB, (r-1)*2, g);

  return [dId, pos];
};

var unscorable = function (ms, id, score, allowPast) {
  var m = T.findMatch(ms, id);
  if (!m) {
    return "match not found in tournament";
  }
  if (m.p[0] === WO || m.p[1] === WO) {
    return "cannot override score in walkover'd match";
  }
  if (m.p[0] === NA || m.p[1] === NA) {
    return "match not ready - missing players";
  }
  if (!Array.isArray(score) || !score.every(Number.isFinite)) {
    return "scores must be a numeric array";
  }
  if (score.length !== 2 || score[0] === score[1]) {
    return "scores must have length 2 and cannot draw";
  }
  if (!allowPast && Array.isArray(m.m)) {
    return "cannot re-score match";
  }
  return null;
};

// updates matches by updating the given match, and propagate the winners/losers
var score = function (right, down, ms, id, score) {
  // 0. error handling - if this fails client didnt guard so we log
  var invReason = unscorable(ms, id, score, true);
  if (invReason !== null) {
    console.error("failed scoring Duel match %s with %j", idString(id), score);
    console.error("reason:", invReason);
    return false;
  }
  //console.log("scoring Duel %s with %j", idString(id), score);

  // 1. score given match
  var m = T.findMatch(ms, id);
  m.m = score; // only map scores are relevant for progression

  // helper to insert player adv into [id, pos] from progression functions
  var playerInsert = function (progress, adv) {
    if (progress) {
      var id = progress[0]
        , pos = progress[1]
        , insertM = T.findMatch(ms, id);

      if (!insertM) {
        var rep = idString(id);
        throw new Error("tournament corrupt: " + rep + " not found!");
      }

      insertM.p[pos] = adv;
      if (insertM.p[(pos + 1) % 2] === WO) {
        insertM.m = (pos) ? [0, 1] : [1, 0]; // set WO map scores
        return insertM.id; // this id was won by adv on WO, inform
      }
    }
  };

  // calculate winner and loser for progression
  var w = (score[0] > score[1]) ? m.p[0] : m.p[1]
    , l = (score[0] > score[1]) ? m.p[1] : m.p[0];

  // an underdog win may force a double match where brackets join
  // currently, this only happens in double elimination in GF1 and isLong
  var underdogWon = (w === m.p[1]);

  // 2. move winner right
  // NB: non-WO match `id` cannot `right` into a WOd match => discard res
  playerInsert(right(id, underdogWon), w);

  // 3. move loser down if applicable
  var dres = playerInsert(down(id, underdogWon), l);

  // 4. check if loser must be forwarded from existing WO in LBR1/LBR2
  // NB: underdogWon is never relevant as LBR2 is always before GF1 when p >= 2
  if (dres) {
    playerInsert(right(dres, false), l);
  }
  return true;
};

var lbPos = function (p, maxr) {
  // model position as y = 2^(k+1) + c_k2^k + 1
  // where k(maxr) = floor(roundDiff/2)
  // works upto and including LB final (gf players must be positioned manually)
  var metric = 2*p - maxr;
  var k = Math.floor(metric/2) - 1; // every other doubles
  if (k < 0) {
    throw new Error("lbPos model works for k>=0 only");
  }
  var ck = Math.pow(2, k) * (metric % 2);
  return Math.pow(2, k + 1) + 1 + ck;
};


var wbPos = function (p, maxr) {
  // similar but simpler, double each round, and note tat ties are + 1
  // works up to and including semis (WBF + BF must be positioned manually)
  return Math.pow(2, p - maxr) + 1;
};


var placement = function (last, p, maxr) {
  return (last === LB) ? lbPos(p, maxr) : wbPos(p, maxr);
};

var results = function (ms, down) {
  var last = this.last
   , p = this.p
   , isLong = this.isLong
   , res = new Array(this.numPlayers);

  for (var s = 0; s < this.numPlayers; s += 1) {
    // TODO: do best scores somehow?
    res[s] = {
      seed : s + 1,
      maps : 0,
      wins : 0
    };
  }

  for (var i = 0; i < ms.length; i += 1) {
    var g = ms[i]
      , isBf = (isLong && last === WB && g.id.s === LB)
      , isWbGf = (last === WB && g.id.s === WB && g.id.r === p)
      , isLbGfs = (last === LB && g.id.s === LB && g.id.r >= 2*p - 1)
      , isLongSemi = (isLong && last === WB && g.id.s === WB && g.id.r === p-1)
      , canPosition = !isBf && !isWbGf && !isLbGfs && !isLongSemi
      , maxr = (last === LB && g.id.s === WB) ? down(g.id, false)[0].r : g.id.r;

    // basic positioning handling of players that may merely have reached the match
    for (var j = 0; j < g.p.length; j += 1) {
      var pX = g.p[j] - 1;
      if (pX >= 0) {
        // position as if we got to maxr (i.e. this, or `down` to immediate loss pos)
        // if we cant position using placement, we are in one of the 4 specials
        // we want position 2 in the finals, but 4 in BF and longSemis (equivalent)
        var specialPosition = 2 + Number(isBf || isLongSemi)*2;
        res[pX].pos = canPosition ? placement(last, p, maxr) : specialPosition;
      }
    }

    if (g.p[0] === WO || g.p[1] === WO || !g.m) {
      // if WO => other player will be found later
      // if unscored, can only keep on assuming worst outcome
      continue;
    }

    // when we have scores, we have a winner and a loser
    var p0 = g.p[0] - 1
      , p1 = g.p[1] - 1
      , w = (g.m[0] > g.m[1]) ? p0 : p1
      , l = (g.m[0] > g.m[1]) ? p1 : p0;

    // inc wins
    res[w].wins += 1;
    res[p0].maps += g.m[0];
    res[p1].maps += g.m[1];

    // finals handling (if played) - overwrites earlier handling
    if (isBf) {
      res[l].pos = 4;
      res[w].pos = 3;
    }
    else if (isWbGf) {
      res[l].pos = 2;
      res[w].pos = 1;
    }
    else if (isLbGfs) {
      res[l].pos = 2;
      res[w].pos = (g.id.r === 2*p || !isLong || p0 === w) ? 1 : 2;
    }
  }
  return res.sort(T.compareRes);
};

// upcoming match always exists in this as winners/losers are propagated immediately
var upcoming = function (ms, pId) {
  // a player is only ever in one unscored match for duel tournaments
  var match = interlude.firstBy(function (m) {
    return m.p.indexOf(pId) >= 0 && !m.m;
  }, ms);
  if (match) {
    return match.id;
  }
};


// interface
function Duel(numPlayers, numBrackets, opts, matches) {
  this.numPlayers = numPlayers;
  this.p = Math.ceil(Math.log(numPlayers) / Math.log(2));
  this.last = numBrackets;

  // isLong is the default final behaviour, which can be turned off via opts.short
  // isLong for WB === hasBF, isLong for LB === hasGf2 (in the sense that they exist)
  this.isLong = true;
  this.limit = 0;
  if (opts) {
    this.isLong = !opts.short;
    this.limit = opts.limit | 0; // not in use atm
  }
  this.right = progressRight.bind(this);
  this.down = progressDown.bind(this);

  this.matches = matches || elimination(numPlayers, this.p, this.last, this.isLong);
}

// an instance can be serialized directly by storing inst.matches
Duel.fromJSON = function (matches, limit) {
  if (!matches.length) {
    console.error("cannot recreate tournament - no matches found");
    return;
  }

  var lbLen = matches.filter(function (m) {
    return m.id.s === LB;
  }).length;
  var last = (lbLen > 1) ? LB : WB; // single allows only one match in LB

  var numPlayers = interlude.maximum(interlude.flatten(interlude.pluck('p', matches)));

  // determining isShort is slightly tricky
  var p = Math.ceil(Math.log(numPlayers) / Math.log(2));
  var gf2 = T.findMatch(matches, {s: LB, r: 2*p, m: 1});
  var isShort = (last === WB && lbLen === 0) || (last === LB && !gf2);
  return (new Duel(numPlayers, last, {short: isShort, limit: limit}, matches));
};

Duel.invalid = invalid;
Duel.idString = idString;

Duel.prototype.unscorable = function (id, mapScore, past) {
  return unscorable(this.matches, id, mapScore, past);
};

Duel.prototype.score = function (id, mapScore) {
  return score(this.right, this.down, this.matches, id, mapScore);
};

// roundName module
//Duel.prototype.roundName = require('./duel_names')({LB: LB, WB: WB});
Duel.prototype.roundName = function (partialId) {
  return roundName({LB: LB, WB: WB}, this.last, this.p, partialId);
};

Duel.prototype.isDone = function () {
  if (!this.isLong) {
    // in short mode, a couple of simplifications apply:
    // the last match is always the final - and the final is always scorable last
    var gf = this.matches[this.matches.length - 1];
    return Array.isArray(gf.m);
  }

  // otherwise we have either a bronze final or a POTENTIAL double grand final
  if (this.matches.every(interlude.get('m'))) {
    return true; // covers single elimination cases bronze final and long double
  }

  // but allDone misses a potential early exit from a short GF in double elimination
  var gf1 = this.matches[this.matches.length - 2];
  return (this.last === LB && Array.isArray(gf1.m) && gf1.m[0] > gf1.m[1]);
};

Duel.prototype.upcoming = function (playerId) {
  return upcoming(this.matches, playerId);
};

Duel.prototype.results = function () {
  return results.call(this, this.matches, this.down);
};

return Duel;

});

helper.factory('RoundRobin', function () {
});
