import demoCourtyard from "../../assets/levels/demo-courtyard.gltf"
import demoCliffs from "../../assets/levels/demo-cliffs.gltf"
import demoSwamp from "../../assets/levels/demo-swamp.gltf"
import yukaPaths from "../../assets/levels/my-navmesh.gltf"

import yoshuaHaystack from "../../assets/npcs/yoshua_haystack.gltf"
import gatekeeperDismayed from "../../assets/npcs/fse--gatekeeper.gltf"
import goatEating from "../../assets/npcs/fse--goat.gltf"
import smithmasterStanding from "../../assets/npcs/fse--smithmaster.gltf"
import yoshuaAlert from "../../assets/portraits/yoshua/alert.svg"
import yoshuaHappy from "../../assets/portraits/yoshua/happy.svg"
import yoshuaSerious from "../../assets/portraits/yoshua/serious.svg"
import gatekeeperPortrait from "../../assets/portraits/gatekeeper/default.svg"
import smithmasterPortrait from "../../assets/portraits/smithmaster/default.svg"
import esthelPortrait from "../../assets/portraits/esthel/default.svg"
import weaponImg from "../../assets/ui/weapon.svg"
import aimedShot from "../../assets/ui/aimed-shot.svg"
import bayonet from "../../assets/ui/bayonet.svg"
import muzzleBlast from "../../assets/ui/muzzle-blast.svg"
import propelSelf from "../../assets/ui/propel-self.svg"

const Content = {
    baseFile: demoCourtyard,
    items:[
      {
        label: "rear-entrance",
        item: {
          name: "Key to the Gatehouse",
          img: "",
          id: "rear-entrance",
          category: "key",
        }
      },
      {
        label: "cage-key",
        item: {
          name: "Cage Key",
          img: "",
          id: "cage-key",
          category: "key",
        }
      },
      {
        label: "healing-flask",
        item: {
          name: "Healing Flask",
          category: "flask"
        }
      },
      {
        label: "fruit",
        item: {
          name: "Fruit",
          category: "fruit"
        }
      }
    ],
    interactions:[
      {
        label: "yoshua-haystack",
        index: 0,
  
        // check when scene is loaded; also check on world_state_changed signal
        // if world conditions don't all match, destroy
        worldConditions: [
          {id:"keyRetrieved", value:true}
        ],
        model: yoshuaHaystack,
        anim: "SIT",
        content: [
          {
            prompt: "Talk to the drowsy interloper",
            nodes:[
              {
              type: "dialogue",
              text: "Ah...is this your haystack? I couldn't resist...I have been running all night.",
              image: yoshuaAlert,
              label: "Drowsy interloper",
              },
              {
                type: "narration",
                image: yoshuaAlert,
                text: "He is a curly haired and delicate adolescent, about your age. His cheeks are flushed with the cold morning air and there is a stalk of hay sticking out of his ear.",
              },
              {
                  type: "dialogue",
                  text: "I am in your debt...are you a castrate? That mask...it is so hard to know if you are angry!",
                  image: yoshuaAlert,
                  label: "Drowsy interloper",
              },
              {
                  type: "dialogue",
                  text: "Forgive me! I mean no offense. I am very tired. I was captured by slavers...",
                  image: yoshuaHappy,
                  label: "Drowsy interloper",
              },
              {
                  type: "dialogue",
                  text: "I am Yoshua. I come from the capital. I was taken there -- along with my sister.",
                  image: yoshuaAlert,
                  label: "Yoshua, fugitive",
              },
              {
                type: "narration",
                text: "He frowns and glances downward. His strange cheeriness melts away.",
                image: yoshuaSerious,
              },
              {
                  type: "dialogue",
                  text: "My sister...they still have her. In a palanquin, deep in the swamp. Would you help me, castrate? I am at your mercy.",
                  image: yoshuaSerious,
                  label: "Yoshua, fugitive",
                  trigger: "help_yoshua"
              },
              {
                type: "dialogue",
                text: "I have little I can offer you...I stole this dagger when I fled. Perhaps you are more skilled with it than I.",
                image: yoshuaSerious,
                label: "Yoshua, fugitive",
              },
              {
                  type: "weapon",
                  text: "You have received [Ceremonial Dagger].",
                  weapon: "ceremonial_dagger",
                  image: yoshuaSerious,
              },
            ]
          },
          {
            prompt: "Talk to Yoshua",
            trigger: null,
            next: null,
            nodes: [
              {
                type: "dialogue",
                text: "I'm so happy you will help me! Let's make for the swamp...the slavers have their camp there. That is where my sister is imprisoned.",
                image: yoshuaHappy,
                label: "Yoshua, fugitive",
              }
            ]
          },
        ],
      },
      {
        label: "gatekeeper-dismayed",
        index: 0,
        // check when scene is loaded; also check on world_state_changed signal
        // if world conditions don't all match, destroy
        worldConditions: [
          {id:"keyRetrieved", value:false}
        ],
        model: gatekeeperDismayed,
        anim: "SIT",
        content: [
          {
            prompt: "Talk to gatekeeper",
            nodes:[
              {
              type: "dialogue",
              text: "Woe!",
              image: gatekeeperPortrait,
              },
              {
                type: "narration",
                image: gatekeeperPortrait,
                text: "The gatekeeper is very upset.",
              },
              {
                  type: "dialogue",
                  text: "Child, I have forgotten the key to the gatehouse's rear entrance...ah..shackles and woe!",
                  image: gatekeeperPortrait,
                  label: "Gatekeeper",
              },
              {
                  type: "dialogue",
                  text: "Will you go to the gatehouse and retrieve it for me? You will have to take the cliff path.",
                  image: gatekeeperPortrait,
                  label: "Gatekeeper",
              },
              {
                  type: "dialogue",
                  text: "Here, I have fixed the scope on your rifle. Please...be careful.",
                  image: gatekeeperPortrait,
                  label: "Gatekeeper",
              },
              {
                type: "weapon",
                text: "You have received [Goatherd's Rifle]. Hover the cursor over the keyboard map below to learn more.",
                weapon: "goatherd-rifle",
                image: gatekeeperPortrait,
              },
              {
                type: "narration",
                text: "The cliff path is dangerous and at times veers into the Old Town. You will need to be very careful...but the gatekeeper could really use your help.",
                image: gatekeeperPortrait,
              },
              {
                  type: "dialogue",
                  text: "Thank you, child! I shall pray for your safe return.",
                  image: gatekeeperPortrait,
                  label: "Gatekeeper",
              },
            ]
          },
          {
            prompt: "Talk to the gatekeeper",
            nodes: [
              {
                type: "narration",
                text: "The gatekeeper is very upset. He will keep fretting until you have unlocked the rear entrance to the gatehouse.",
                image: gatekeeperPortrait,
              }
            ]
          },
        ],
      },
      {
        label: "gatekeeper-relieved",
        index: 0,
  
        // check when scene is loaded; also check on world_state_changed signal
        // if world conditions don't all match, destroy
        worldConditions: [
          {id:"keyRetrieved", value:true}
        ],
        model: gatekeeperDismayed,
        anim: "SIT",
  
        content: [
          {
            prompt: "Talk to the gatekeeper",
            nodes: [
              {
                type: "dialogue",
                text: "Thank you, child! How proud I am of you.",
                image: gatekeeperPortrait,
                label: "Gatekeeper",
              },
              {
                type: "narration",
                text: "The gatekeeper still seems pretty upset. Perhaps the Smithmaster has yelled at him again.",
                image: gatekeeperPortrait,
                label: "Gatekeeper",
              }
            ]
          },
          {
            prompt: "Talk to the gatekeeper",
            nodes: [
              {
                type: "narration",
                text: "The gatekeeper still seems pretty upset. Perhaps the Smithmaster has yelled at him again.",
                image: gatekeeperPortrait,
                label: "Gatekeeper",
              }
            ]
          },
        ],
      },
      {
        label: "smithmaster-morning",
        index: 0,
  
        // check when scene is loaded; also check on world_state_changed signal
        // if world conditions don't all match, destroy
        worldConditions: [
          {id:"keyRetrieved", value:true}
        ],
        model: smithmasterStanding,
        anim: "STAND",
  
        content: [
          {
            prompt: "Talk to the smithmaster",
            nodes: [
              {
                type: "dialogue",
                text: "Are you helping that old fool again, castrate? Tend to your goats and leave him to his tottering about.",
                image: smithmasterPortrait,
                label: "Smithmaster",
              },
              {
                type: "dialogue",
                text: "If we are lucky, perhaps he will totter off a cliff and we will all be freed from his whining.",
                image: smithmasterPortrait,
                label: "Smithmaster",
              },
              {
                type: "dialogue",
                text: "Besides, those goats of yours have been been screeching since the sun rose. Run along and see what the matter is with them -- they keep me from my work.",
                image: smithmasterPortrait,
                label: "Smithmaster",
              },
            ]
          },
          {
            prompt: "Talk to the smithmaster",
            nodes: [
              {
                type: "dialogue",
                text: "Those goats of yours have been been screeching since the sun rose. Run along and see what the matter is with them -- they keep me from my work.",
                image: smithmasterPortrait,
                label: "Smithmaster",
              },
            ]
          },
        ],
      },
      {
        label: "goat-eating",
        index: 0,
  
        // check when scene is loaded; also check on world_state_changed signal
        // if world conditions don't all match, destroy
        worldConditions: [
          {id:"keyRetrieved", value:false}
        ],
        model: goatEating,
        anim: "EAT",
  
        content: [
          {
            prompt: "Look at the goats",
            nodes: [
              {
                type: "narration",
                text: "The goats are happily munching away on the fresh swampgrass. They won't be moving anytime soon.",
                label: "The Goats",
              }
            ]
          },
        ],
      },
      {
        label: "esthel-captive",
        index: 0,
  
        // check when scene is loaded; also check on world_state_changed signal
        // if world conditions don't all match, destroy
        worldConditions: [
          {id:"keyRetrieved", value:true}
        ],
        model: yoshuaHaystack,
        anim: "SIT",
  
        content: [
          {
            prompt: "Talk to the captive",
            nodes: [
              {
                type: "dialogue",
                text: "What are you?",
                image: esthelPortrait,
                label: "Captive girl",
              },
              {
                type: "narration",
                text: "Her voice is clear and her tone imperious. Her skin has the same alabaster sheen as her brother's, but her eyes are icy and steady. You have opened the cage but she does not move.",
                image: esthelPortrait,
                label: "Captive girl",
              },
              {
                type: "dialogue",
                text: "Ah, I see. You are a castrate. I was not aware that castrates were still in use.",
                image: esthelPortrait,
                label: "Captive girl",
              },
              {
                type: "narration",
                text: "She regards you a moment longer, studying the contours of your mask. Her eyes catch the copper dagger on your belt",
                image: esthelPortrait,
                label: "Captive girl",
              },
              {
                type: "dialogue",
                text: "You carry the Spring's Blade. You have met my brother? I am Esthel. Will you bring me to Yoshua, castrate?",
                image: esthelPortrait,
                label: "Esthel",
              },
              {
                type: "narration",
                text: "Her eyes finally snap away from you. She examines her cage with a brisk finality, as if noting which memories of her imprisonment to carry with her and which to leave behind.",
                image: esthelPortrait,
                label: "Esthel",
              },
              {
                type: "dialogue",
                text: "You have freed me from my captors. I thank you, castrate. Bring me to my brother.",
                image: esthelPortrait,
                label: "Esthel",
              },
            ]
          },
          {
            prompt: "Talk to Esthel",
            nodes: [
              {
                type: "dialogue",
                text: "You have freed me from my captors. I thank you, castrate. Bring me to my brother.",
                image: esthelPortrait,
                label: "Esthel",
              },
            ]
          },
        ],
      },
    ],
    // you receive ceremonial dagger from yoshua.
    // you get the rifle from the gatekeeper w weapon tutorial popup
    weapons: [
      {
        label: "goatherd-rifle",
        name: "Goatherd's Rifle",
        id: "goatherd-rifle",
        image: weaponImg,
        description: "Given to you by the Gatekeeper for fending off antwolves in the hills",
        setBonus: "sure_footed",
        actions: [
          {
            id: "shoot_from_distance",
            label: "Precision Shot",
            caption: "Loading rifle",
            image: muzzleBlast,
            description: "You eyes narrow and time seems to slow. You kneel and take careful aim.",
            primeLength: 0,
            baseDamage: 25,
            cost: 30,
            isInstant: true,
            range: 40,
            primed: false,
            assignment: null,
            primeAnimation: "load",
            animation: "shoot",
            primaryModifier: "Energy Cost: 20",
            secondaryModifier: "Mana Cost: 0",
          },
          {
            id: "bayonet_slash",
            label: "Slash with bayonet",
            description: "A quick slice with the bayonet attachment on the rifle.",
            image: bayonet,
            caption: "Affixing bayonet",
            primeLength: 0.6,
            isInstant: true,
            cost: 40,
            baseDamage: 10,
            range: 5,
            primed: false,
            assignment: null,
            primeAnimation: "load",
            animation: "slash",
            primaryModifier: "Energy Cost: 0",
            secondaryModifier: "Mana Cost: 40",
          },
          {
            id: "shotgun_blast",
            label: "Blast at close range",
            caption: "Loading rifle",
            description: "An explosion of deadly flechette darts, highly effective at close range.",
            primeLength: 1,
            baseDamage: 50,
            cost: 50,
            image: aimedShot,
            range: 30,
            primed: false,
            isInstant: false,
            locked: true,
            assignment: null,
            primeAnimation: "load",
            animation: "fire",
            primaryModifier: "Faith",
            secondaryModifier: "Bravado",
          },
          {
            id: "gouge_with_bayonet",
            label: "Gouge with bayonet",
            description: "Stuns enemy for 3 seconds or until attacked.",
            caption: "Shifting weight",
            primeLength: 0.6,
            image: propelSelf,
            cost: 105,
            baseDamage: 0,
            isInstant: true,
            locked: true,
            range: 5,
            primed: false,
            assignment: null,
            primeAnimation: "load",
            animation: "club",
            primaryModifier: "Faith",
            secondaryModifier: "Bravado",
          },
        ]
      },
      {
        name: "Ceremonial Dagger",
        label: "ceremonial_dagger",
        id: "ceremonial-dagger",
        image: weaponImg,
        description: "Although free from ornamentation, this simple copper blade is warm to the touch. It seems to pulsaate in your hand.",
        primary: "Cruelty",
        actions: [
          {
            id: "XX",
            label: "Sacrificial Lamb",
            caption: "Preparing the ritual",
            description: "Increases energy received from being damaged for 12 seconds. Chance to pulsate (energy to 100).",
            image: weaponImg,
            primeLength: 2,
            baseDamage: 25,
            locked: true,
            range: 5,
            primed: false,
            assignment: null,
            primeAnimation: "withdraw",
            animation: "lose_yourself",
            primaryModifier: "Cruelty",
            secondaryModifier: "Bravado",
          },
          {
            id: "open_artery",
            label: "Open artery",
            description: "Dart in with the blade. A steady stream of blood springs forth.",
            image: weaponImg,
            isInstant: true,
            baseDamage: 25,
            locked: true,
            range: 5,
            primed: false,
            assignment: null,
            primeAnimation: "withdraw",
            animation: "open_artery",
            primaryModifier: "Cruelty",
            secondaryModifier: "Guile",
          },
          {
            id: "parry",
            label: "Parry with dagger",
            caption: "Gathering strength",
            description: "Enter pulsate if successful.",
            image: weaponImg,
            primeLength: 1,
            baseDamage: 25,
            range: 5,
            locked: true,
            primed: false,
            assignment: null,
            primeAnimation: "withdraw",
            animation: "pommel_smack",
            primaryModifier: "Cruelty",
            secondaryModifier: "Guile",
          },
          {
            id: "stab_in_frenzy",
            label: "Stab in a frenzy",
            description: "Strike savagely multiple times. Must be in pulsate.",
            image: weaponImg,
            secondary: "",
            primeLength: 1,
            locked: true,
            baseDamage: 25,
            range: 5,
            primed: false,
            assignment: null,
            primeAnimation: "withdraw",
            animation: "thrust_slash",
            primaryModifier: "Cruelty",
            secondaryModifier: "Bravado",
          },
        ]
      },
    ],
    enemies:[
    ],
    doors:[
      {
        label: "rear-entrance",
        prompt: "Open rear door of gatehouse",
        unlockedBy: "rear-entrance"
      },
      {
        label: "prisoner-cage",
        prompt: "Open cage",
        unlockedBy: "cage-key"
      },
    ],
  }

  export default Content
  