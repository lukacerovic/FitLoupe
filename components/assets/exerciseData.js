const exerciseData = // BICEPS
[
    { id: 1, name: 'barbell curls' },
    { id: 2, name: 'dumbell curls' },
    { id: 3, name: 'hammer curls' },
    { id: 4, name: 'preacher curls' },
    { id: 5, name: 'concentration curls' },
    { id: 6, name: 'ez bar curls' },
    { id: 7, name: 'cable curls' },
    { id: 8, name: 'reverse curls' },
    { id: 9, name: 'chin-ups' },
    { id: 10, name: 'incline dumbell curls' },
    { id: 11, name: 'kettlebell curls' },
    { id: 12, name: 'zottman curls' },
    { id: 13, name: 'cross-body hammer curls' },
    { id: 14, name: 'alternating bicep curls' },
    { id: 15, name: 'preacher cable curls' },
    { id: 16, name: 'close-grip chin-ups' },
    { id: 17, name: 'wide-grip chin-ups' },
    { id: 18, name: 'neutral-grip chin-ups' },
    { id: 19, name: 'weighted chin-ups' },
    { id: 20, name: 'assisted chin-ups' },
    { id: 21, name: 'band curls' },
    { id: 22, name: 'machine curls' },
    { id: 23, name: 'incline bench dumbell curls' },
    { id: 24, name: 'scott curls' },
    { id: 25, name: 'seated alternating dumbell curls' },
    { id: 26, name: 'preacher hammer curls' },
    { id: 27, name: 'wrist curls' },
    { id: 28, name: 'reverse preacher curls' },
    { id: 29, name: 'preacher curls with resistance bands' },
    { id: 30, name: 'standing cable curls with rope attachment' },
    { id: 31, name: 'one-arm cable curls' },
    { id: 32, name: 'sledgehammer curls' },
    { id: 33, name: 'plate curls' },
    { id: 34, name: 'towel curls' },
    { id: 35, name: 'drag curls' },
    { id: 36, name: 'zercher curls' },
    { id: 37, name: 'barbell spider curls' },
    { id: 38, name: 'barbell 21s' },
    { id: 39, name: 'barbell drag curls' },
    { id: 40, name: 'barbell concentration curls' },
    { id: 41, name: 'seated machine curls' },
    { id: 42, name: 'standing one-arm cable curls' },
    { id: 43, name: 'high cable curls' },
    { id: 44, name: 'low cable curls' },
    { id: 45, name: 'inverted rows' },
    { id: 46, name: 'suspension trainer curls' },
    { id: 47, name: 'isometric curls' },
    { id: 48, name: 'biceps blaster curls' },
    { id: 49, name: 'standing resistance band curls' },
    { id: 50, name: 'resistance band drag curls' },
    { id: 51, name: 'standing concentration curls with cables' },
  

  // tRicEps

  { id: 52, name: 'close-grip bench press' },
  { id: 53, name: 'tricep dips' },
  { id: 54, name: 'tricep pushdowns' },
  { id: 55, name: 'overhead tricep extensions' },
  { id: 56, name: 'skull crushers' },
  { id: 57, name: 'tricep kickbacks' },
  { id: 58, name: 'cable overhead tricep extensions' },
  { id: 59, name: 'bench dips' },
  { id: 60, name: 'diamond push-ups' },
  { id: 61, name: 'rope pushdowns' },
  { id: 62, name: 'dumbell tricep extensions' },
  { id: 63, name: 'seated tricep dips' },
  { id: 64, name: 'one-arm tricep pushdowns' },
  { id: 65, name: 'tricep rope overhead extensions' },
  { id: 66, name: 'tate pres' },
  { id: 67, name: 'reverse grip pushdowns' },
  { id: 68, name: 'close-grip push-ups' },
  { id: 69, name: 'ez bar skull crushers' },
  { id: 70, name: 'bodyweight tricep extensions' },
  { id: 71, name: 'standing overhead dumbell tricep extensions' },
  { id: 72, name: 'close-grip pushdowns with v-bar atachment' },
  { id: 73, name: 'tricep press machine' },
  { id: 74, name: 'bench skull crushers' },
  { id: 75, name: 'dumbbell kickbacks' },
  { id: 76, name: 'seated tricep press' },
  { id: 77, name: 'tricep bench press' },
  { id: 78, name: 'incline dumbbell tricep extensions' },
  { id: 79, name: 'one-arm cable pushdowns' },
  { id: 80, name: 'diamond bench press' },
  { id: 81, name: 'tricep dips on stability ball' },
  { id: 82, name: 'french press' },
  { id: 83, name: 'bent-over dumbbell tricep kickbacks' },
  { id: 84, name: 'seated overhead tricep extensions with dumbbell' },
  { id: 85, name: 'tricep machine dips' },
  { id: 86, name: 'close-grip dumbbell press' },
  { id: 87, name: 'plyometric push-ups' },
  { id: 88, name: 'resistance band tricep pushdowns' },
  { id: 89, name: 'dumbbell squeeze press' },
  { id: 90, name: 'tricep dips on dip machine' },
  { id: 91, name: 'single-arm dumbbell tricep kickbacks' },
  { id: 92, name: 'rope tricep pushdowns with underhand grip' },
  { id: 93, name: 'tricep burpees' },
  { id: 94, name: 'close-grip medicine ball push-ups' },
  { id: 95, name: 'bench tricep dips with feet elevated' },
  { id: 96, name: 'incline cable tricep extensions' },
  { id: 97, name: 'cable tricep pulldowns' },
  { id: 98, name: 'standing dumbbell tricep curls' },
  { id: 99, name: 'tricep resistance band overhead extensions' },
  { id: 100, name: 'tricep rope pushdowns with pronated grip' },
  { id: 101, name: 'bench close-grip push-ups' },
 
  


  // GRUDi

  { id: 102, name: 'barbell bench press' },
  { id: 103, name: 'dumbbell bench press' },
  { id: 104, name: 'push-ups' },
  { id: 105, name: 'incline bench press' },
  { id: 106, name: 'decline bench press' },
  { id: 107, name: 'chest dips' },
  { id: 108, name: 'cable flyes' },
  { id: 109, name: 'dumbbell flyes' },
  { id: 110, name: 'incline dumbbell bench press' },
  { id: 111, name: 'decline dumbbell bench pres' },
  { id: 112, name: 'machine chest pres' },
  { id: 113, name: 'smith machine bench pres' },
  { id: 114, name: 'floor press' },
  { id: 115, name: 'wide push-ups' },
  { id: 116, name: 'close grip bench pres' },
  { id: 117, name: 'single-arm dumbbell bench pres' },
  { id: 118, name: 'plyometric push-ups' },
  { id: 119, name: 'landmine press' },
  { id: 120, name: 'resistance band chest pres' },
  { id: 121, name: 'squeeze press' },
  { id: 122, name: 'chest pres machine' },
  { id: 123, name: 'swiss ball dumbbell chest pres' },
  { id: 124, name: 'explosive medicine ball push-ups' },
  { id: 125, name: 'chest squeeze flyes' },
  { id: 126, name: 'cross-body cable flyes' },
  { id: 127, name: 'reverse grip bench press' },
  { id: 128, name: 'rush-up variations' },
  { id: 129, name: 'incline cable flyes' },
  { id: 130, name: 'dip machine' },
  { id: 131, name: 'single-arm cable chest press' },
  { id: 132, name: 'standing cable chest press' },
  { id: 133, name: 'stability ball dumbbell chest press' },
  { id: 134, name: 'smith machine incline bench press' },
  { id: 135, name: 'one-and-a-half bench press' },
  { id: 136, name: 'seated chest press machine' },
  { id: 137, name: 'chest press with resistance bands' },
  { id: 138, name: 'dumbbell pullover' },
  { id: 139, name: 'cable chest press with rotation' },
  { id: 140, name: 'plate squeeze press' },
  { id: 141, name: 'bosu ball push-ups' },
  { id: 142, name: 'swiss ball push-ups' },
  { id: 143, name: 'cable crossover' },
  { id: 144, name: 'resistance band flyes' },
  { id: 145, name: 'medicine ball chest pass' },
  { id: 146, name: 'incline push-ups' },
  { id: 147, name: 'decline push-ups' },
  { id: 148, name: 'isometric chest contractions' },
  { id: 149, name: 'incline dumbbell flyes' },
  { id: 150, name: 'decline cable flyes' },
  { id: 151, name: 'low cable chest flyes' },
  { id: 152, name: 'stability ball push-ups' },


  // GoRNJA LEDJA

  { id: 153, name: 'bent-over barbell rows' },
  { id: 154, name: 't-bar rows' },
  { id: 155, name: 'seated cable rows' },
  { id: 156, name: 'one-arm dumbbell rows' },
  { id: 157, name: 'bent-over dumbbell rows' },
  { id: 158, name: 'chin-ups' },
  { id: 159, name: 'pull-ups' },
  { id: 160, name: 'lat pulldowns' },
  { id: 161, name: 'wide grip lat pulldowns' },
  { id: 162, name: 'close grip lat pulldowns' },
  { id: 163, name: 'cable pullovers' },
  { id: 164, name: 'inverted rows' },
  { id: 165, name: 'reverse grip bent-over rows' },
  { id: 166, name: 'smith machine rows' },
  { id: 167, name: 'pendlay rows' },
  { id: 168, name: 'wide grip pull-ups' },
  { id: 169, name: 'single-arm cable rows' },
  { id: 170, name: 'face pulls' },
  { id: 171, name: 'renegade rows' },
  { id: 172, name: 'dumbbell pullovers' },
  { id: 173, name: 'cable face pulls' },
  { id: 174, name: 'single-arm lat pulldowns' },
  { id: 175, name: 'kettlebell rows' },
  { id: 176, name: 'resistance band rows' },
  { id: 177, name: 'hammer strength rows' },
  { id: 178, name: 'chest-supported dumbbell rows' },
  { id: 179, name: 'meadows rows' },
  { id: 180, name: 'seated machine rows' },
  { id: 181, name: 'supine rows' },
  { id: 182, name: 'landmine rows' },
  { id: 183, name: 'scapular retractions' },
  { id: 184, name: 'straight-arm pulldowns' },
  { id: 185, name: 'barbell shrugs' },
  { id: 186, name: 'dumbbell shrugs' },
  { id: 187, name: 'cable shrugs' },
  { id: 188, name: 'upright rows' },
  { id: 189, name: 'high pulls' },
  { id: 190, name: 'prone trap raises' },
  { id: 191, name: 'seated high rows' },
  { id: 192, name: 'cable reverse flyes' },
  { id: 193, name: 'kroc rows' },
  { id: 194, name: 'bent-over rear delt raises' },
  { id: 195, name: 'wide grip cable rows' },
  { id: 196, name: 'single-arm hammer strength rows' },
  { id: 197, name: 'trx rows' },
  { id: 198, name: 'incline bench dumbbell rows' },
  { id: 199, name: 'bent-arm pullovers' },
  { id: 200, name: 'resistance band pull-aparts' },
  { id: 201, name: 'rope face pulls' },
  { id: 202, name: 'kettlebell high pulls' },
  { id: 203, name: 'band pull-aparts' },


  // sREDNJA LEDJA

  { id: 204, name: 'barbell rows' },
  { id: 205, name: 'dumbbell rows' },
  { id: 206, name: 'cable rows' },
  { id: 207, name: 'seated cable rows' },
  { id: 208, name: 't-bar rows' },
  { id: 209, name: 'one-arm dumbbell rows' },
  { id: 210, name: 'bent-over rows' },
  { id: 211, name: 'chest-supported rows' },
  { id: 212, name: 'reverse grip rows' },
  { id: 213, name: 'inverted rows' },
  { id: 214, name: 'machine rows' },
  { id: 215, name: 'landmine rows' },
  { id: 216, name: 'kroc rows' },
  { id: 217, name: 'pendlay rows' },
  { id: 218, name: 'yates rows' },
  { id: 219, name: 'meadows rows' },
  { id: 220, name: 'wide grip rows' },
  { id: 221, name: 'close grip rows' },
  { id: 222, name: 'face pulls' },
  { id: 223, name: 'scapular retractions' },
  { id: 224, name: 'cable face pulls' },
  { id: 225, name: 'prone trap raises' },
  { id: 226, name: 'single-arm cable rows' },
  { id: 227, name: 'resistance band rows' },
  { id: 228, name: 'bent-arm pullovers' },
  { id: 229, name: 'straight-arm pulldowns' },
  { id: 230, name: 'seated high rows' },
  { id: 231, name: 'cable reverse flyes' },
  { id: 232, name: 'rope face pulls' },
  { id: 233, name: 'resistance band pull-aparts' },
  { id: 234, name: 'trx rows' },
  { id: 235, name: 'kettlebell rows' },
  { id: 236, name: 'dumbbell pullovers' },
  { id: 237, name: 'wide grip cable rows' },
  { id: 238, name: 'single-arm hammer strength rows' },
  { id: 239, name: 'prone rows' },
  { id: 240, name: 'dumbbell shrugs' },
  { id: 241, name: 'barbell shrugs' },
  { id: 242, name: 'cable shrugs' },
  { id: 243, name: 'upright rows' },
  { id: 244, name: 'high pulls' },
  { id: 245, name: 'incline bench dumbbell rows' },
  { id: 246, name: 'low cable rows' },
  { id: 247, name: 'bent-over rear delt raises' },
  { id: 248, name: 'single-arm landmine rows' },
  { id: 249, name: 'smith machine rows' },
  { id: 250, name: 'machine pullovers' },
  { id: 251, name: 'renegade rows' },
  { id: 252, name: 'scapular push-ups' },
  { id: 253, name: 'resistance band face pulls' },
  { id: 254, name: 'standing cable rows' },
  


 //  DoNJA LEDJA
 { id: 255, name: 'deadlifts' },
 { id: 256, name: 'romanian deadlifts' },
 { id: 257, name: 'good mornings' },
 { id: 258, name: 'hyperextensions' },
 { id: 259, name: 'back extensions' },
 { id: 260, name: 'reverse hypers' },
 { id: 261, name: 'superman holds' },
 { id: 262, name: 'bird dogs' },
 { id: 263, name: 'swiss ball back extensions' },
 { id: 264, name: 'cable pull-throughs' },
 { id: 265, name: 'kettlebell swings' },
 { id: 266, name: 'barbell hip thrusts' },
 { id: 267, name: 'glute bridges' },
 { id: 268, name: 'single-leg romanian deadlifts' },
 { id: 269, name: 'single-leg glute bridges' },
 { id: 270, name: 'quadruped leg lifts' },
 { id: 271, name: 'stability ball hyperextensions' },
 { id: 272, name: 'prone cobra' },
 { id: 273, name: 'plank variations' },
 { id: 274, name: 'russian twists' },
 { id: 275, name: 'medicine ball rotational throws' },
 { id: 276, name: 'standing cable rotations' },
 { id: 277, name: 'seated twists' },
 { id: 278, name: 'woodchoppers' },
 { id: 279, name: 'pallof presses' },
 { id: 280, name: 'side bends' },
 { id: 281, name: 'farmers walks' },
 { id: 282, name: 'overhead carries' },
 { id: 283, name: 'suitcase carries' },
 { id: 284, name: 'lateral band walks' },
 { id: 285, name: 'banded good mornings' },
 { id: 286, name: 'jefferson deadlifts' },
 { id: 287, name: 'sumo deadlifts' },
 { id: 288, name: 'single-arm dumbbell deadlifts' },
 { id: 289, name: 'dumbbell step-ups' },
 { id: 290, name: 'bulgarian split squats' },
 { id: 291, name: 'lunges' },
 { id: 292, name: 'stability ball rollouts' },
 { id: 293, name: 'ab wheel rollouts' },
 { id: 294, name: 'lying leg raises' },
 { id: 295, name: 'hanging leg raises' },
 { id: 296, name: 'seated leg tucks' },
 { id: 297, name: 'swiss ball knee tucks' },
 { id: 298, name: 'cable woodchoppers' },
 { id: 299, name: 'single-arm cable pull-downs' },
 { id: 300, name: 'single-leg cable pull-throughs' },
 { id: 301, name: 'lying hip abductions' },
 { id: 302, name: 'reverse lunges' },
 { id: 303, name: 'barbell front squats' },
 { id: 304, name: 'cable pull-downs with rope attachment' },
 { id: 305, name: 'single-leg cable kickbacks' },


   // RAMENA
   { id: 306, name: 'barbell overhead press' },
   { id: 307, name: 'dumbbell shoulder press' },
   { id: 308, name: 'seated shoulder press machine' },
   { id: 309, name: 'arnold press' },
   { id: 310, name: 'push press' },
   { id: 311, name: 'push jerk' },
   { id: 312, name: 'military press' },
   { id: 313, name: 'standing dumbbell lateral raises' },
   { id: 314, name: 'cable lateral raises' },
   { id: 315, name: 'bent-over lateral raises' },
   { id: 316, name: 'front raises' },
   { id: 317, name: 'upright rows' },
   { id: 318, name: 'dumbbell shrugs' },
   { id: 319, name: 'barbell shrugs' },
   { id: 320, name: 'farmer\'s walks' },
   { id: 321, name: 'kettlebell swings' },
   { id: 322, name: 'kettlebell high pulls' },
   { id: 323, name: 'face pulls' },
   { id: 324, name: 'cable reverse flyes' },
   { id: 325, name: 'rear delt flyes' },
   { id: 326, name: 'band pull-aparts' },
   { id: 327, name: 'scapular retractions' },
   { id: 328, name: 'shoulder press with resistance bands' },
   { id: 329, name: 'plate front raises' },
   { id: 330, name: 'plate circles' },
   { id: 331, name: 'landmine presses' },
   { id: 332, name: 'handstand push-ups' },
   { id: 333, name: 'pike push-ups' },
   { id: 334, name: 'wall slides' },
   { id: 335, name: 'incline bench reverse flyes' },
   { id: 336, name: 'single-arm kettlebell press' },
   { id: 337, name: 'cable front raises' },
   { id: 338, name: 'cable face pulls' },
   { id: 339, name: 'cable lateral raises with rope attachment' },
   { id: 340, name: 'cable bent-over lateral raises' },
   { id: 341, name: 'dumbbell armpit rows' },
   { id: 342, name: 'dumbbell push press' },
   { id: 343, name: 'dumbbell hammer curls to press' },
   { id: 344, name: 'lateral raises with resistance bands' },
   { id: 345, name: 'front raises with resistance bands' },
   { id: 346, name: 'bent-over reverse flyes with resistance bands' },
   { id: 347, name: 'battle rope slams' },
   { id: 348, name: 'medicine ball slams' },
   { id: 349, name: 'prone YTWs' },
   { id: 350, name: 'resistance band external rotations' },
   { id: 351, name: 'resistance band shoulder dislocations' },
   { id: 352, name: 'seated dumbbell cleans' },
   { id: 353, name: 'single-arm landmine press' },
   { id: 354, name: 'single-arm cable lateral raises' },
   { id: 355, name: 'stability ball dumbbell shoulder press' },
   { id: 356, name: 'pike press on stability ball' },


   //STOMAK
   { id: 357, name: 'crunches' },
   { id: 358, name: 'reverse crunches' },
   { id: 359, name: 'bicycle crunches' },
   { id: 360, name: 'plank' },
   { id: 361, name: 'side plank' },
   { id: 362, name: 'russian twists' },
   { id: 363, name: 'mountain climbers' },
   { id: 364, name: 'hanging leg raises' },
   { id: 365, name: 'flutter kicks' },
   { id: 366, name: 'sit-ups' },
   { id: 367, name: 'v-ups' },
   { id: 368, name: 'toe touches' },
   { id: 369, name: 'dead bug' },
   { id: 370, name: 'scissor kicks' },
   { id: 371, name: 'pilates hundred' },
   { id: 372, name: 'woodchoppers' },
   { id: 373, name: 'cable crunches' },
   { id: 374, name: 'swiss ball crunches' },
   { id: 375, name: 'russian twists with medicine ball' },
   { id: 376, name: 'plank with hip dips' },
   { id: 377, name: 'side plank with leg lifts' },
   { id: 378, name: 'standing oblique twists' },
   { id: 379, name: 'lying leg raises' },
   { id: 380, name: 'captain\'s chair leg raises' },
   { id: 381, name: 'medicine ball slams' },
   { id: 382, name: 'spiderman planks' },
   { id: 383, name: 'ab wheel rollouts' },
   { id: 384, name: 'turkish get-ups' },
   { id: 385, name: 'stability ball pikes' },
   { id: 386, name: 'incline sit-ups' },
   { id: 387, name: 'decline sit-ups' },
   { id: 388, name: 'cable woodchoppers' },
   { id: 389, name: 'pallof press' },
   { id: 390, name: 'seated russian twists' },
   { id: 391, name: 'hanging windshield wipers' },
   { id: 392, name: 'renegade rows' },
   { id: 393, name: 'reverse woodchoppers' },
   { id: 394, name: 'l-sit holds' },
   { id: 395, name: 'plank with knee tucks' },
   { id: 396, name: 'hanging knee raises' },
   { id: 397, name: 'stability ball knee tucks' },
   { id: 398, name: 'mountain climber sliders' },
   { id: 399, name: 'swiss ball pikes' },
   { id: 400, name: 'side plank with knee tucks' },
   { id: 401, name: 'bicycle crunches with twist' },
   { id: 402, name: 'dragon flags' },
   { id: 403, name: 'hollow body holds' },
   { id: 404, name: 'standing cable crunches' },
   { id: 405, name: 'barbell ab rollouts' },
   { id: 406, name: 'hanging l-sit leg raises' },
   { id: 407, name: 'plank with alternating arm and leg lifts' },



  //NOGE

  //1) GLUTEUS
  { id: 408, name: 'barbell hip thrusts' },
  { id: 409, name: 'glute bridges' },
  { id: 410, name: 'single-leg hip thrusts' },
  { id: 411, name: 'romanian deadlifts' },
  { id: 412, name: 'sumo deadlifts' },
  { id: 413, name: 'bulgarian split squats' },
  { id: 414, name: 'lunges' },
  { id: 415, name: 'step-ups' },
  { id: 416, name: 'cable kickbacks' },
  { id: 417, name: 'cable pull-throughs' },
  { id: 418, name: 'hip abductions' },
  { id: 419, name: 'clamshells' },
  { id: 420, name: 'fire hydrants' },
  { id: 421, name: 'donkey kicks' },
  { id: 422, name: 'single-leg deadlifts' },
  { id: 423, name: 'frog pumps' },
  { id: 424, name: 'glute-focused squats' },
  { id: 425, name: 'glute-focused lunges' },
  { id: 426, name: 'band walks' },
  { id: 427, name: 'hip thrust variations' },
  { id: 428, name: 'glute bridges with leg lifts' },
  { id: 429, name: 'curtsy lunges' },
  { id: 430, name: 'reverse lunges with knee drives' },
  { id: 431, name: 'kettlebell swings' },
  { id: 432, name: 'barbell or dumbbell squats' },
  { id: 433, name: 'cable hip abductions' },
  { id: 434, name: 'resistance band squats with lateral leg lifts' },
  { id: 435, name: 'cable diagonal lunges' },
  { id: 436, name: 'hip thrusts with abduction' },
  { id: 437, name: 'bulgarian split squats with elevated back foot' },
  { id: 438, name: 'side-lying hip abductions' },
  { id: 439, name: 'goblet squats' },
  { id: 440, name: 'glute-focused step-ups' },
  { id: 441, name: 'hip thrusts with resistance band around knees' },
  { id: 442, name: 'single-leg glute bridges with foot elevated' },
  { id: 443, name: 'cable pull-throughs with hip hinge' },
  { id: 444, name: 'glute-focused deadlifts' },
  { id: 445, name: 'hip abductions on the abductor machine' },
  { id: 446, name: 'jump squats' },
  { id: 447, name: 'reverse hyperextensions' },
  { id: 448, name: 'frog leaps' },
  { id: 449, name: 'glute-focused lunges with back leg extension' },
  { id: 450, name: 'single-leg squats' },
  { id: 451, name: 'cable hip thrusts' },
  { id: 452, name: 'glute-focused leg press' },
  { id: 453, name: 'barbell or dumbbell hip hinge' },
  { id: 454, name: 'sumo squats' },
  { id: 455, name: 'resistance band seated abductions' },
  { id: 456, name: 'step-ups with knee lifts' },
  { id: 457, name: 'stability ball hamstring curls' },
  { id: 458, name: 'glute-focused cable squats' },



  //2) LIST
  { id: 459, name: 'standing calf raises' },
  { id: 460, name: 'seated calf raises' },
  { id: 461, name: 'calf raises on a leg press machine' },
  { id: 462, name: 'donkey calf raises' },
  { id: 463, name: 'single-leg calf raises' },
  { id: 464, name: 'standing dumbbell calf raises' },
  { id: 465, name: 'calf raises on a Smith machine' },
  { id: 466, name: 'toe raises on a step' },
  { id: 467, name: 'calf raises using resistance bands' },
  { id: 468, name: 'calf raises on a calf machine' },
  { id: 469, name: "farmer's walks on toes" },
  { id: 470, name: 'jump rope' },
  { id: 471, name: 'box jumps' },
  { id: 472, name: 'skipping' },
  { id: 473, name: 'calf raises on a balance board' },
  { id: 474, name: 'calf raises on a slant board' },
  { id: 475, name: 'calf raises on a BOSU ball' },
  { id: 476, name: 'standing calf jumps' },
  { id: 477, name: 'calf raises on a stair climber machine' },
  { id: 478, name: 'calf raises on a treadmill incline' },
  { id: 479, name: 'calf raises on a leg extension machine' },
  { id: 480, name: 'calf raises with a weighted backpack' },
  { id: 481, name: 'calf raises with a barbell across shoulders' },
  { id: 482, name: 'calf raises with a kettlebell' },
  { id: 483, name: 'calf raises with a sandbag' },
  { id: 484, name: 'calf raises on a leg curl machine' },
  { id: 485, name: 'calf raises on a stability ball' },
  { id: 486, name: 'calf raises on a vibration plate' },
  { id: 487, name: 'calf raises with a resistance machine' },
  { id: 488, name: 'calf raises on a trx suspension trainer' },
  { id: 489, name: 'calf raises with a medicine ball' },
  { id: 490, name: 'calf raises on an incline bench' },
  { id: 491, name: 'calf raises with a partner providing resistance' },
  { id: 492, name: 'calf raises on a foam roller' },
  { id: 493, name: 'calf raises on a wobble board' },
  { id: 494, name: 'calf raises on a decline bench' },
  { id: 495, name: 'calf raises on a standing platform' },
  { id: 496, name: 'calf raises on a decline machine' },
  { id: 497, name: 'calf raises with a sandbag over one shoulder' },
  { id: 498, name: 'calf raises on a balance disc' },
  { id: 499, name: 'calf raises with a resistance band around the knees' },
  { id: 500, name: 'calf raises on a Smith machine with one leg' },
  { id: 501, name: 'calf raises on a leg press machine with one leg' },
  { id: 502, name: 'calf raises with a barbell in front of the thighs' },
  { id: 503, name: 'calf raises with a barbell behind the neck' },
  { id: 504, name: 'calf raises on an angled leg press machine' },
  { id: 505, name: 'calf raises with a resistance band anchored to a wall' },
  { id: 506, name: 'calf raises on a step with one leg' },
  { id: 507, name: 'calf raises with a weight plate on the lap' },
  { id: 508, name: 'calf raises with a barbell on the back of the shoulders' },
  { id: 509, name: 'calf raises with a dumbbell in one hand' },



 //Kvadriceps
 { id: 510, name: 'pistol squats' },
 { id: 511, name: 'box jumps' },
 { id: 512, name: 'wall sits' },
 { id: 513, name: 'sumo squats' },
 { id: 514, name: 'jump squats' },
 { id: 515, name: 'curtsy lunges' },
 { id: 516, name: 'sissy squats' },
 { id: 517, name: 'jefferson squats' },
 { id: 518, name: 'zercher squats' },
 { id: 519, name: 'single-leg squats' },
 { id: 520, name: 'barbell lunges' },
 { id: 521, name: 'split squats' },
 { id: 522, name: 'step lunges' },
 { id: 523, name: 'dumbbell squats' },
 { id: 524, name: 'cable squats' },
 { id: 525, name: 'smith machine squats' },
 { id: 526, name: 'resistance band squats' },
 { id: 527, name: 'overhead squats' },
 { id: 528, name: 'plyometric lunges' },
 { id: 529, name: 'bulgarian split jumps' },
 { id: 530, name: 'lateral lunges' },
 { id: 531, name: 'swiss ball squats' },
 { id: 532, name: 'VMO squats' },
 { id: 533, name: 'isometric wall squats' },
 { id: 534, name: 'scissor lunges' },
 { id: 535, name: 'barbell step-ups' },
 { id: 536, name: 'kettlebell front squats' },
 { id: 537, name: 'landmine squats' },
 { id: 538, name: 'reverse lunges with knee drives' },
 { id: 539, name: 'TRX squats' },
 { id: 540, name: 'dumbbell step-ups' },
 { id: 541, name: 'wide stance squats' },
 { id: 542, name: 'cossack squats' },
 { id: 543, name: 'front rack lunges' },
 { id: 544, name: 'barbell box squats' },
 { id: 545, name: 'resistance band step-ups' },
 { id: 546, name: 'plate-loaded squats' },
 { id: 547, name: 'hack lunges' },
 { id: 548, name: 'dumbbell box step-ups' },
 { id: 549, name: 'cable split squats' },
 { id: 550, name: 'slideboard lunges' },
 { id: 551, name: 'barbell overhead lunges' },



 //KARDIO
 { id: 552, name: 'treadmill incline walking' },
 { id: 553, name: 'treadmill speed intervals' },
 { id: 554, name: 'treadmill hill climbs' },
 { id: 555, name: 'elliptical machine' },
 { id: 556, name: 'stationary bike' },
 { id: 557, name: 'rowing machine' },
 { id: 558, name: 'stair climber' },
 { id: 559, name: 'ski erg' },
 { id: 560, name: 'spin bike' },
 { id: 561, name: 'air bike' },
 { id: 562, name: 'battle ropes' },
 { id: 563, name: 'box jumps' },
 { id: 564, name: 'sled pushes or pulls' },
 { id: 565, name: 'jump rope' },
];
  
export default exerciseData;







































































































































































































































































































































































































































































































  

  