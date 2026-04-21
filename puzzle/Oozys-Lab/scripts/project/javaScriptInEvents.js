function color_normalize(array) {
    return array.map(value => value / 255);
}

function color_mix(a, b) {
    return [
        (a[0] + b[0]) / 2,
        (a[1] + b[1]) / 2,
        (a[2] + b[2]) / 2
    ];
}

function apply_colorscheme(effect, start, end) {
    start = color_normalize(start);
    end = color_normalize(end);
    effect.setParameter(0, start);
    effect.setParameter(2, end);
}

function to_degrees(radians) {
    return radians * (180 / Math.PI);
}

function to_radians(degrees) {
    return degrees * (Math.PI / 180);
}

const scriptsInEvents = {

	async Loader_Event2_Act5(runtime, localVars)
	{
// DEBUG!!!
localStorage.clear();

const savegame = localStorage.getItem(`${runtime.projectName}_save`);

if (savegame) {
    try {
        let data = JSON.parse(savegame);
        globalThis.savegame = data;
		runtime.globalVars.new_player = false;
    } catch (e) {
        // corrupted or invalid json
        console.warn("json parse failed");
		runtime.globalVars.new_player = true;
		globalThis.savegame = {"current_world": 1, "current_level": 1};
    }
} else {
    runtime.globalVars.new_player = true;
	globalThis.savegame = {"current_world": 1, "current_level": 1};
}
	},

	async Loader_Event7_Act2(runtime, localVars)
	{
		globalThis.color_data = runtime.objects.colors.getFirstInstance().getJsonDataCopy();
	},

	async Loader_Event8_Act1(runtime, localVars)
	{
		runtime.globalVars.current_level = globalThis.savegame.current_level;
		runtime.globalVars.current_world = globalThis.savegame.current_world;
	},

	async General_Event2_Act1(runtime, localVars)
	{
globalThis.savegame = {
	"current_level": runtime.globalVars.current_level,
	"current_world": runtime.globalVars.current_world
};

localStorage.setItem(`${runtime.projectName}_save`, JSON.stringify(globalThis.savegame));
	},

	async General_Event4_Act1(runtime, localVars)
	{
		runtime.globalVars.current_level += 1;
		runtime.globalVars.current_world = Math.floor((runtime.globalVars.current_level-1) / 5) + 1;
		
		try {
			const test = runtime.getLayout("level" + runtime.globalVars.current_level);
			runtime.goToLayout("level" + runtime.globalVars.current_level);
		} catch (e) {
			runtime.globalVars.current_level = 1;
			runtime.callFunction("save_game");
			runtime.goToLayout("level1");
		}
	},

	async General_Event5_Act1(runtime, localVars)
	{
		try {
			const test = runtime.getLayout("level" + runtime.globalVars.current_level);
			runtime.goToLayout("level" + runtime.globalVars.current_level);
		} catch (e) {
			runtime.globalVars.current_level = 1;
			runtime.callFunction("save_game");
			runtime.goToLayout("level1");
		}
	},

	async Game_Event42_Act3(runtime, localVars)
	{
		const up_angle = 270;
		let diff = localVars.steepness - up_angle;
		diff = ((diff % 360) + 360) % 360;
		diff = diff > 180 ? diff - 360 : diff;
		let steepness_deg = Math.abs(diff);
		steepness_deg = Math.min(steepness_deg, 90);
		localVars.steepness = Math.pow(Math.max(0, 1 - steepness_deg / 15), 2);
	},

	async Game_Event107_Act1(runtime, localVars)
	{
		localVars.r = globalThis.colors.accent.start[0];
		localVars.g = globalThis.colors.accent.start[1];
		localVars.b = globalThis.colors.accent.start[2];
	},

	async Game_Event109_Act1(runtime, localVars)
	{
		globalThis.colors = globalThis.color_data.worlds[runtime.globalVars.current_world-1];
		
		for(const b of runtime.objects.button.instances()) {
			b.colorRgb = color_normalize(globalThis.colors.accent.start);
		}
		
		const goal = runtime.objects.goal_door.getFirstInstance();
		goal.colorRgb = color_normalize(globalThis.colors.accent.start);
		goal.getChildAt(0).colorRgb = color_normalize(globalThis.colors.accent.start);
		
		const transition_layer = runtime.layout.getLayer("TRANSITION");
		transition_layer.backgroundColor = color_normalize(globalThis.colors.background.end);
		
		runtime.layout.getLayer("background_grad").backgroundColor = color_normalize(globalThis.colors.background.start);
		runtime.objects.background_gradient.getFirstInstance().colorRgb = color_normalize(globalThis.colors.background.end);
		
		runtime.layout.getLayer("solids_grad").backgroundColor = color_normalize(globalThis.colors.solids.start);
		runtime.objects.solid_gradient.getFirstInstance().colorRgb = color_normalize(globalThis.colors.solids.end);
	},

	async Game_Event110_Act1(runtime, localVars)
	{
		if(!globalThis.colors) {
			globalThis.colors = globalThis.color_data.worlds[runtime.globalVars.current_world-1];
		}
		runtime.objects.all_text.getFirstPickedInstance().fontColor = color_normalize(globalThis.colors.accent.start);
	},

	async Game_Event111_Act1(runtime, localVars)
	{
		if(!globalThis.colors) {
			globalThis.colors = globalThis.color_data.worlds[runtime.globalVars.current_world-1];
		}
		
		const player = runtime.objects.player.getFirstInstance();
		const player_transition = runtime.objects.transition_player.getFirstInstance();
		player.colorRgb = color_normalize(globalThis.colors.accent.start);
		player.getChildAt(0).colorRgb = color_normalize(globalThis.colors.accent.end);
		player.getChildAt(0).getChildAt(0).colorRgb = color_normalize(globalThis.colors.accent.end);
		player_transition.colorRgb = color_normalize(globalThis.colors.accent.start);
		player_transition.getChildAt(0).colorRgb = color_normalize(globalThis.colors.accent.end);
	},

	async Game_Event169_Act3(runtime, localVars)
	{
		const button = runtime.objects.button.getFirstPickedInstance();
		const func = button.instVars.function.split("|");
		
		if(button.instVars.audio !== "") runtime.callFunction("play_audio", button.instVars.audio, button.instVars.audio + button.uid, true, -5);
		
		//const solid_anchors = runtime.objects.solid_anchor.getAllInstances();//.filter(e => e.instVars.signal_receiver === button.instVars.signal);
		const signal_receiver_sprites = runtime.objects.signal_receiver_sprite.getAllInstances();//.filter(e => e.instVars.signal_receiver === button.instVars.signal);
		const receiver = [...signal_receiver_sprites].filter(e => e.instVars.signal_receiver !== "" && e.instVars.signal_receiver.split(",").some(item => button.instVars.signal.split(",").includes(item)));
		
		if (func[0] === "rotate_level") {
			const level = runtime.layout;
			button.behaviors.Tween.startTween("value", to_degrees(level.angle) + parseInt(func[1]), 0.5, "linear", {"startValue": to_degrees(level.angle), "tags": "level_rotate"});
		} else if (func[0] === "saw_follow") {
			const player = runtime.objects.player.getFirstInstance();
			receiver[0].behaviors.Follow.startFollowing(player, true);
		} else if (func[0] === "reverse_gravity") {
			const player = runtime.objects.player.getFirstInstance();
			player.behaviors.Physics.behavior.worldGravity = -player.behaviors.Physics.behavior.worldGravity;
			player.instVars.gravity_reversed = -player.instVars.gravity_reversed;
		} else if (func[0] === "slide") {
			const player = runtime.objects.player.getFirstInstance();
			player.instVars.slide = true;
			runtime.callFunction("set_camera_offset_X", 300);
			button.behaviors.Tween.startTween("value", -11, 0.5, "linear", {"startValue": 0, "tags": "level_rotate"});
		} else if (func[0] === "invisible_player") {
			const player = runtime.objects.player.getFirstInstance();
			player.behaviors.Tween.startTween("opacity", 0, 1.5, "linear");
		} else if (func[0] === "set_gravity") {
			const player = runtime.objects.player.getFirstInstance();
			player.behaviors.Physics.behavior.worldGravity = parseFloat(func[1]);
		} else if (func[0] === "player_motor") {
			const player = runtime.objects.player.getFirstInstance();
			player.instVars.motor = parseInt(func[1]);
		} else if (func[0] === "screenwrap") {
			const player = runtime.objects.player.getFirstInstance();
			player.instVars.screenwrap = true;
		
			const wrap_top = runtime.objects.screenwrap_visual.createInstance("main", runtime.layout.width, 0);
			const wrap_bot = runtime.objects.screenwrap_visual.createInstance("main", runtime.layout.width, runtime.layout.height-21);
		
			wrap_top.width = runtime.layout.width*10;
			wrap_bot.width = runtime.layout.width*10;
		
			wrap_top.colorRgb = color_normalize(globalThis.colors.accent.end);
			wrap_bot.colorRgb = color_normalize(globalThis.colors.accent.end);
		}
		
		receiver.forEach(r => {
			if(func[0] === "tween") {
				const dir_factor = r.instVars.tween_dir_factor.split(",").map(v => parseFloat(v));
				const dir_extra = r.instVars.tween_extra.split(",").map(v => parseInt(v));
				let duration = r.instVars.tween_duration_override > 0 ? r.instVars.tween_duration_override : func[3];
				const pos = func[2].split(",").map(v => parseInt(v));
				r.instVars.playerpush_x = Math.sign(pos[0]*dir_factor[0]+dir_extra[0]);
				r.instVars.playerpush_y = Math.sign(pos[1]*dir_factor[1]+dir_extra[1]);
				r.behaviors.Tween.startTween(func[1], [r.x+pos[0]*dir_factor[0]+dir_extra[0],r.y+pos[1]*dir_factor[1]+dir_extra[1]], parseFloat(duration), func[4], {"tags": "move"});
				if(r.hasChildren) r.getChildAt(0).behaviors.Physics.isAwake = true;
			} else if (func[0] === "set_enabled") {
				r.behaviors[func[1]].isEnabled = true
			} else if (func[0] === "sine") {
				const dir_factor = r.instVars.tween_dir_factor.split(",").map(v => parseFloat(v));
				const dir_extra = r.instVars.tween_extra.split(",").map(v => parseInt(v));
				let duration = r.instVars.tween_duration_override > 0 ? r.instVars.tween_duration_override : func[3];
				const pos = func[2].split(",").map(v => parseInt(v));
				console.warn("move" + button.instVars.add_tag);
				r.behaviors.Tween.startTween(func[1], [r.x+pos[0]*dir_factor[0]+dir_extra[0],r.y+pos[1]*dir_factor[1]+dir_extra[1]], parseFloat(duration), func[4], {"pingPong": true, "loop": true, "tags": "move" + button.instVars.add_tag});
				if(r.hasChildren) r.getChildAt(0).behaviors.Physics.isAwake = true;
			}
		})
	},

	async Game_Event129_Act10(runtime, localVars)
	{
		globalThis.colors = globalThis.color_data.worlds[runtime.globalVars.current_world];
		
		for(const txt of runtime.objects.all_text.instances()) {
			txt.fontColor = color_normalize(globalThis.colors.accent.start);
		}
		
		const transition_layer = runtime.layout.getLayer("TRANSITION");
		transition_layer.backgroundColor = color_normalize(globalThis.colors.background.end);
	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
