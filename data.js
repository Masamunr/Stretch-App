/* ---------------------------------------------------------
   Stretch data
   Each pose is an original hand-drawn illustration (no
   photos/stock art, so no copyright concerns): a clear stick
   figure where the specific muscle being stretched is drawn
   in the accent color (not a floating marker), plus a small
   arrow showing the direction of movement.
--------------------------------------------------------- */

const CONTEXTS = [
  { id: 'morning',      label: 'Morning' },
  { id: 'deskbreak',    label: 'Desk Break' },
  { id: 'postworkout',  label: 'Post-Workout' },
  { id: 'bedtime',      label: 'Bedtime' },
];

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

// Canonical muscle-group taxonomy used for both display and filtering.
const MUSCLE_GROUPS = [
  'Neck', 'Shoulders', 'Chest', 'Arms', 'Spine / Back', 'Core',
  'Hips / Glutes', 'Hamstrings', 'Quads', 'Calves', 'Full Body',
];

function svg(inner) {
  return `<svg viewBox="0 0 100 100" class="pose-svg" aria-hidden="true">${inner}</svg>`;
}
const GROUND = '<line x1="8" y1="93" x2="92" y2="93" class="ground"/>';

const STRETCHES = [
  {
    id: 'neck-tilt', name: 'Neck Tilt (Side)', part: 'Neck',
    contexts: ['morning', 'deskbreak'], difficulty: 'beginner',
    duration: 20, sides: true,
    cue: 'Sit or stand tall. Gently drop one ear toward that shoulder until you feel a stretch along the opposite side of your neck. Keep shoulders level.',
    img: svg(`${GROUND}
      <circle cx="50" cy="24" r="9"/>
      <line x1="50" y1="33" x2="47" y2="60"/>
      <line x1="47" y1="60" x2="35" y2="92"/><line x1="47" y1="60" x2="59" y2="92"/>
      <line x1="49" y1="38" x2="30" y2="30"/>
      <line class="target" x1="47" y1="40" x2="66" y2="55"/>
      <polyline class="arrow" points="42,30 34,26 40,20"/>`),
  },
  {
    id: 'neck-rotation', name: 'Chin-to-Chest Rotation', part: 'Neck',
    contexts: ['morning', 'deskbreak'], difficulty: 'beginner',
    duration: 20,
    cue: 'Lower your chin toward your chest, then slowly roll your head halfway to the right, then halfway to the left. Move slowly, no forcing.',
    img: svg(`${GROUND}
      <circle cx="50" cy="26" r="9"/>
      <line x1="50" y1="35" x2="50" y2="60"/>
      <line x1="50" y1="60" x2="38" y2="92"/><line x1="50" y1="60" x2="62" y2="92"/>
      <line class="target" x1="50" y1="42" x2="30" y2="55"/>
      <line class="target" x1="50" y1="42" x2="70" y2="55"/>
      <polyline class="arrow" points="58,44 65,50 58,56"/>`),
  },
  {
    id: 'shoulder-rolls', name: 'Shoulder Rolls', part: 'Shoulders',
    contexts: ['morning', 'deskbreak', 'postworkout'], difficulty: 'beginner',
    duration: 30,
    cue: 'Lift both shoulders up toward your ears, roll them back, then down. Repeat slowly, then reverse direction.',
    img: svg(`${GROUND}
      <circle cx="50" cy="24" r="9"/>
      <line x1="50" y1="33" x2="50" y2="60"/>
      <line x1="50" y1="60" x2="38" y2="92"/><line x1="50" y1="60" x2="62" y2="92"/>
      <path class="target" d="M50 38 Q32 30 30 45" fill="none"/>
      <path class="target" d="M50 38 Q68 30 70 45" fill="none"/>
      <polyline class="arrow" points="64,32 70,38 64,44"/>`),
  },
  {
    id: 'cross-body-shoulder', name: 'Cross-Body Shoulder Stretch', part: 'Shoulders',
    contexts: ['postworkout', 'deskbreak'], difficulty: 'beginner',
    duration: 20, sides: true,
    cue: 'Bring one arm straight across your chest. Use the other forearm to gently press it closer. Keep that shoulder relaxed, away from your ear.',
    img: svg(`${GROUND}
      <circle cx="50" cy="24" r="9"/>
      <line x1="50" y1="33" x2="50" y2="60"/>
      <line x1="50" y1="60" x2="38" y2="92"/><line x1="50" y1="60" x2="62" y2="92"/>
      <line class="target" x1="50" y1="40" x2="75" y2="45"/>
      <line x1="50" y1="40" x2="20" y2="42"/><line x1="20" y1="42" x2="30" y2="30"/>
      <polyline class="arrow" points="33,36 25,42 33,48"/>`),
  },
  {
    id: 'overhead-triceps', name: 'Overhead Triceps Stretch', part: 'Arms',
    contexts: ['morning', 'postworkout'], difficulty: 'beginner',
    duration: 20, sides: true,
    cue: 'Raise one arm overhead, bend the elbow so your hand reaches down your back. Use the other hand to gently press the elbow further.',
    img: svg(`${GROUND}
      <circle cx="50" cy="24" r="9"/>
      <line x1="50" y1="33" x2="50" y2="60"/>
      <line x1="50" y1="60" x2="38" y2="92"/><line x1="50" y1="60" x2="62" y2="92"/>
      <line class="target" x1="50" y1="38" x2="60" y2="15"/>
      <line class="target" x1="60" y1="15" x2="55" y2="45"/>
      <line x1="50" y1="45" x2="35" y2="50"/>
      <polyline class="arrow" points="46,42 52,50 58,42"/>`),
  },
  {
    id: 'wrist-flexor', name: 'Wrist Flexor Stretch', part: 'Arms',
    contexts: ['deskbreak', 'postworkout'], difficulty: 'beginner',
    duration: 20, sides: true,
    cue: 'Extend one arm forward, palm up. With the other hand, gently pull the fingers back toward you until you feel a stretch through the forearm.',
    img: svg(`${GROUND}
      <circle cx="28" cy="30" r="9"/>
      <line x1="28" y1="39" x2="30" y2="60"/>
      <line x1="30" y1="60" x2="22" y2="92"/><line x1="30" y1="60" x2="40" y2="92"/>
      <line class="target" x1="28" y1="45" x2="75" y2="48"/>
      <line x1="60" y1="40" x2="72" y2="50"/>
      <polyline class="arrow" points="66,42 74,48 66,54"/>`),
  },
  {
    id: 'chest-opener', name: 'Chest Opener', part: 'Chest',
    contexts: ['morning', 'postworkout', 'deskbreak'], difficulty: 'beginner',
    duration: 30,
    cue: 'Clasp your hands behind your back and gently lift them while opening your chest and squeezing your shoulder blades together.',
    img: svg(`${GROUND}
      <circle cx="50" cy="24" r="9"/>
      <line x1="50" y1="33" x2="50" y2="60"/>
      <line x1="50" y1="60" x2="38" y2="92"/><line x1="50" y1="60" x2="62" y2="92"/>
      <line class="target" x1="37" y1="44" x2="63" y2="44"/>
      <path d="M50 40 Q28 45 32 65" fill="none"/>
      <path d="M50 40 Q72 45 68 65" fill="none"/>
      <line x1="32" y1="65" x2="68" y2="65"/>
      <polyline class="arrow" points="38,58 30,63 38,68"/>
      <polyline class="arrow" points="62,58 70,63 62,68"/>`),
  },
  {
    id: 'standing-side-bend', name: 'Standing Side Bend', part: 'Spine / Back',
    contexts: ['morning', 'postworkout'], difficulty: 'beginner',
    duration: 20, sides: true,
    cue: 'Reach one arm overhead and lean your torso to the opposite side, feeling a stretch along your ribs and waist. Keep hips facing forward.',
    img: svg(`${GROUND}
      <circle cx="58" cy="22" r="9"/>
      <path class="target" d="M55 31 Q40 55 45 90" fill="none"/>
      <line x1="45" y1="90" x2="35" y2="92"/><line x1="45" y1="90" x2="58" y2="92"/>
      <line x1="55" y1="35" x2="20" y2="30"/>
      <path class="target" d="M55 35 Q75 45 78 20" fill="none"/>
      <polyline class="arrow" points="48,50 42,58 50,64"/>`),
  },
  {
    id: 'seated-twist', name: 'Seated Spinal Twist', part: 'Spine / Back',
    contexts: ['postworkout', 'bedtime'], difficulty: 'intermediate',
    duration: 20, sides: true,
    cue: 'Sit with legs extended, cross one foot over the other knee, and gently rotate your torso toward the bent-knee side, hand braced behind you.',
    img: svg(`
      <circle cx="55" cy="30" r="9"/>
      <line class="target" x1="55" y1="39" x2="52" y2="65"/>
      <line x1="52" y1="65" x2="20" y2="72"/>
      <line x1="52" y1="65" x2="35" y2="88"/><line x1="35" y1="88" x2="60" y2="80"/>
      <line class="target" x1="55" y1="45" x2="72" y2="60"/>
      <line x1="55" y1="42" x2="35" y2="35"/>
      <polyline class="arrow" points="56,46 63,53 56,58"/>`),
  },
  {
    id: 'cat-cow', name: 'Cat-Cow Flow', part: 'Spine / Back',
    contexts: ['morning', 'postworkout'], difficulty: 'beginner',
    duration: 30,
    cue: 'On hands and knees, alternate between arching your back up (cat) and dipping it down while lifting your chest (cow). Move with your breath.',
    img: svg(`
      <circle cx="78" cy="40" r="8"/>
      <path class="target" d="M70 45 Q45 30 22 45" fill="none"/>
      <line x1="22" y1="45" x2="20" y2="70"/><line x1="70" y1="45" x2="72" y2="70"/>
      <line x1="30" y1="55" x2="28" y2="80"/><line x1="60" y1="55" x2="62" y2="80"/>
      <polyline class="arrow" points="40,38 46,30 52,38"/>
      <polyline class="arrow" points="40,52 46,60 52,52"/>`),
  },
  {
    id: 'childs-pose', name: "Child's Pose", part: 'Spine / Back',
    contexts: ['bedtime', 'postworkout'], difficulty: 'beginner',
    duration: 45,
    cue: 'Kneel and sit back onto your heels, then fold forward with arms stretched out ahead, forehead resting toward the floor. Breathe deeply.',
    img: svg(`
      <circle cx="80" cy="70" r="8"/>
      <path class="target" d="M74 68 Q45 62 18 30" fill="none"/>
      <line x1="18" y1="30" x2="14" y2="35"/>
      <line x1="70" y1="72" x2="55" y2="88"/><line x1="55" y1="88" x2="75" y2="90"/>
      <polyline class="arrow" points="24,34 16,30 22,24"/>`),
  },
  {
    id: 'cobra', name: 'Cobra / Sphinx Stretch', part: 'Core',
    contexts: ['morning', 'postworkout'], difficulty: 'beginner',
    duration: 30,
    cue: 'Lie face down, place forearms or hands under your shoulders, and gently press up, lifting your chest while keeping hips on the floor.',
    img: svg(`${GROUND}
      <circle cx="72" cy="55" r="8"/>
      <path d="M65 58 Q45 60 20 88" fill="none"/>
      <path class="target" d="M55 62 Q46 72 42 84" fill="none"/>
      <line x1="55" y1="70" x2="60" y2="90"/><line x1="65" y1="65" x2="68" y2="90"/>
      <polyline class="arrow" points="62,58 68,50 72,58"/>`),
  },
  {
    id: 'standing-forward-fold', name: 'Standing Forward Fold', part: 'Hamstrings',
    contexts: ['morning', 'postworkout'], difficulty: 'intermediate',
    duration: 30,
    cue: 'Stand with feet hip-width apart, hinge at the hips and let your torso hang toward the floor. Soften your knees, let your head relax.',
    img: svg(`${GROUND}
      <circle cx="50" cy="45" r="8"/>
      <path d="M50 53 Q46 65 50 78" fill="none"/>
      <line x1="50" y1="78" x2="42" y2="92"/><line x1="50" y1="78" x2="58" y2="92"/>
      <line class="target" x1="46" y1="58" x2="38" y2="80"/>
      <polyline class="arrow" points="44,72 50,78 56,72"/>`),
  },
  {
    id: 'seated-hamstring', name: 'Seated Hamstring Stretch', part: 'Hamstrings',
    contexts: ['postworkout', 'bedtime'], difficulty: 'beginner',
    duration: 30, sides: true,
    cue: 'Sit with one leg extended, the other bent with the foot near your inner thigh. Hinge forward over the straight leg, reaching toward your foot.',
    img: svg(`
      <circle cx="72" cy="45" r="8"/>
      <path class="target" d="M66 48 Q45 55 25 60" fill="none"/>
      <line class="target" x1="25" y1="60" x2="24" y2="88"/>
      <line x1="60" y1="55" x2="50" y2="72"/>
      <line x1="66" y1="55" x2="60" y2="85"/><line x1="60" y1="85" x2="72" y2="85"/>
      <polyline class="arrow" points="34,56 26,60 34,66"/>`),
  },
  {
    id: 'standing-quad', name: 'Standing Quad Stretch', part: 'Quads',
    contexts: ['postworkout', 'morning'], difficulty: 'intermediate',
    duration: 20, sides: true,
    cue: 'Stand tall (hold something for balance if needed), bend one knee and grab that ankle, gently pulling your heel toward your glutes.',
    img: svg(`${GROUND}
      <circle cx="50" cy="24" r="9"/>
      <line x1="50" y1="33" x2="50" y2="60"/>
      <line x1="50" y1="60" x2="38" y2="92"/>
      <path class="target" d="M50 60 Q58 75 50 82" fill="none"/>
      <line x1="50" y1="82" x2="55" y2="60"/>
      <line x1="50" y1="40" x2="60" y2="72"/>
      <polyline class="arrow" points="52,70 58,78 62,70"/>`),
  },
  {
    id: 'hip-flexor-lunge', name: 'Kneeling Hip Flexor Lunge', part: 'Hips / Glutes',
    contexts: ['postworkout', 'morning'], difficulty: 'intermediate',
    duration: 30, sides: true,
    cue: 'Kneel on one knee, other foot planted forward. Shift your weight forward gently until you feel a stretch across the front of the kneeling hip.',
    img: svg(`${GROUND}
      <circle cx="35" cy="45" r="8"/>
      <line class="target" x1="35" y1="53" x2="40" y2="72"/>
      <line x1="40" y1="72" x2="60" y2="70"/><line x1="60" y1="70" x2="65" y2="92"/>
      <line x1="40" y1="72" x2="30" y2="90"/><line x1="30" y1="90" x2="45" y2="90"/>
      <polyline class="arrow" points="58,76 66,82 58,88"/>`),
  },
  {
    id: 'figure-4', name: 'Figure-4 Hip Stretch', part: 'Hips / Glutes',
    contexts: ['postworkout', 'bedtime'], difficulty: 'intermediate',
    duration: 30, sides: true,
    cue: 'Lying on your back, cross one ankle over the opposite knee. Reach through and pull the uncrossed thigh toward your chest.',
    img: svg(`<line x1="8" y1="80" x2="92" y2="80" class="ground"/>
      <circle cx="18" cy="70" r="8"/>
      <line x1="26" y1="70" x2="55" y2="72"/><line x1="55" y1="72" x2="55" y2="45"/>
      <line class="target" x1="55" y1="60" x2="75" y2="55"/>
      <polyline class="arrow" points="68,46 76,52 68,58"/>`),
  },
  {
    id: 'pigeon', name: 'Pigeon Pose', part: 'Hips / Glutes',
    contexts: ['postworkout', 'bedtime'], difficulty: 'advanced',
    duration: 45, sides: true,
    cue: 'From all fours, bring one knee forward toward your wrist, angling the shin across your body, and extend the other leg straight back. Fold forward if comfortable.',
    img: svg(`<line x1="8" y1="90" x2="92" y2="90" class="ground"/>
      <circle cx="30" cy="55" r="8"/>
      <path class="target" d="M35 58 Q50 62 60 60" fill="none"/>
      <line x1="60" y1="60" x2="82" y2="80"/>
      <line x1="35" y1="65" x2="25" y2="85"/><line x1="25" y1="85" x2="45" y2="85"/>
      <polyline class="arrow" points="46,66 52,72 58,66"/>`),
  },
  {
    id: 'butterfly', name: 'Butterfly Stretch', part: 'Hips / Glutes',
    contexts: ['bedtime', 'postworkout'], difficulty: 'beginner',
    duration: 45,
    cue: 'Sit with the soles of your feet together, knees out to the sides. Hold your feet and gently press your knees toward the floor, back straight.',
    img: svg(`
      <circle cx="50" cy="35" r="9"/>
      <line x1="50" y1="44" x2="50" y2="65"/>
      <path class="target" d="M50 65 Q30 68 30 82" fill="none"/>
      <path class="target" d="M50 65 Q70 68 70 82" fill="none"/>
      <line x1="30" y1="82" x2="70" y2="82"/>
      <polyline class="arrow" points="35,74 30,80 40,80"/>
      <polyline class="arrow" points="65,74 70,80 60,80"/>`),
  },
  {
    id: 'calf-stretch', name: 'Calf Stretch (Wall)', part: 'Calves',
    contexts: ['postworkout', 'morning'], difficulty: 'beginner',
    duration: 20, sides: true,
    cue: 'Facing a wall, step one foot back and press its heel into the floor, leaning forward with a straight back leg until you feel the stretch in your calf.',
    img: svg(`${GROUND}
      <circle cx="42" cy="24" r="8"/>
      <line x1="42" y1="32" x2="42" y2="60"/>
      <line class="target" x1="42" y1="60" x2="65" y2="92"/>
      <line x1="42" y1="60" x2="30" y2="92"/>
      <line x1="42" y1="36" x2="70" y2="30"/>
      <polyline class="arrow" points="58,84 65,90 58,96"/>`),
  },
  {
    id: 'downward-dog', name: 'Downward Dog', part: 'Full Body',
    contexts: ['morning', 'postworkout'], difficulty: 'intermediate',
    duration: 30,
    cue: 'From all fours, tuck your toes and lift your hips up and back, forming an inverted V. Press your heels toward the floor and let your head relax.',
    img: svg(`${GROUND}
      <circle cx="70" cy="50" r="8"/>
      <path class="target" d="M64 55 Q45 40 30 70" fill="none"/>
      <line x1="64" y1="55" x2="82" y2="88"/>
      <line class="target" x1="30" y1="70" x2="18" y2="88"/>
      <polyline class="arrow" points="40,50 45,42 50,50"/>`),
  },
  {
    id: 'knee-to-chest', name: 'Knee-to-Chest Stretch', part: 'Hips / Glutes',
    contexts: ['bedtime', 'morning'], difficulty: 'beginner',
    duration: 20, sides: true,
    cue: 'Lying on your back, pull one knee toward your chest with both hands, keeping the other leg relaxed on the floor or bent.',
    img: svg(`<line x1="8" y1="80" x2="92" y2="80" class="ground"/>
      <circle cx="18" cy="70" r="8"/>
      <line x1="26" y1="70" x2="50" y2="72"/>
      <line class="target" x1="50" y1="72" x2="45" y2="45"/>
      <line x1="26" y1="66" x2="45" y2="48"/>
      <line x1="50" y1="72" x2="78" y2="78"/>
      <polyline class="arrow" points="50,52 56,46 60,52"/>`),
  },
];

/* ---------------------------------------------------------
   Pre-built routines
--------------------------------------------------------- */
const ROUTINES = [
  {
    id: 'morning-wakeup', name: 'Morning Wake-Up', context: 'morning', difficulty: 'beginner',
    blurb: 'Gentle full-body wake-up to loosen up before your day starts.',
    stretchIds: ['neck-rotation', 'shoulder-rolls', 'cat-cow', 'standing-side-bend', 'downward-dog', 'standing-forward-fold', 'knee-to-chest'],
  },
  {
    id: 'desk-break', name: 'Desk Break Reset', context: 'deskbreak', difficulty: 'beginner',
    blurb: 'A quick reset for neck, shoulders and wrists after sitting for a while.',
    stretchIds: ['neck-tilt', 'shoulder-rolls', 'cross-body-shoulder', 'wrist-flexor', 'seated-twist'],
  },
  {
    id: 'postworkout-cooldown', name: 'Post-Workout Cooldown', context: 'postworkout', difficulty: 'intermediate',
    blurb: 'Cool down the major muscles worked in a typical training session.',
    stretchIds: ['standing-quad', 'calf-stretch', 'seated-hamstring', 'hip-flexor-lunge', 'chest-opener', 'overhead-triceps', 'standing-forward-fold', 'figure-4'],
  },
  {
    id: 'bedtime-winddown', name: 'Bedtime Wind-Down', context: 'bedtime', difficulty: 'beginner',
    blurb: 'Slow, floor-based stretches to relax the body before sleep.',
    stretchIds: ['childs-pose', 'butterfly', 'knee-to-chest', 'seated-twist', 'figure-4'],
  },
  {
    id: 'full-body-deep', name: 'Full Body Deep Stretch', context: 'postworkout', difficulty: 'advanced',
    blurb: 'A longer, deeper full-body session covering nearly everything.',
    stretchIds: ['neck-rotation', 'shoulder-rolls', 'chest-opener', 'cat-cow', 'downward-dog', 'standing-forward-fold', 'standing-quad', 'hip-flexor-lunge', 'pigeon', 'seated-hamstring', 'figure-4', 'calf-stretch'],
  },
];
