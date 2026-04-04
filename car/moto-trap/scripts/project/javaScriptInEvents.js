

const scriptsInEvents = {

	async EventSheet1_Event53_Act3(runtime, localVars)
	{
		const loc = runtime.objects.localization.getFirstInstance();
		
		for (let y = 0; y < loc.height; y++) {
		    for (let x = 0; x < loc.width; x++) {
		        const val = loc.getAt(x, y);
		        if (val.includes("\\n")) {
		            loc.setAt(val.replace(/\\n/g, "\n"), x, y);
		        }
		    }
		}
	},

	async EventSheet1_Event1663_Act1(runtime, localVars)
	{
		window.addEventListener("keydown", () => 
		  runtime.callFunction("set_player_device", "pc")
		);
		
		window.addEventListener("mousedown", (e) => {
		  if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
		  runtime.callFunction("set_player_device", "pc");
		});
		
		window.addEventListener("touchstart", () => 
		  runtime.callFunction("set_player_device", "mobile")
		);
	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
