// var component = {
// 	id : 1
// 	Type : "resistor"
// 	Voltage : 1
// 	Resistance : 1
// 	Nextcomponent : [2,3]
// 	previousComponent : [0]
// 	parallelDepth : 1
// }

var componentArray = [{id:0, type:"cell", voltage:9, resistance:0, current:0, nextComponent:[1], previousComponent:[2,3], parallelDepth:null}, //cell
	{id:1, type:"resistor1", voltage:0, resistance:1, current:0, nextComponent:[2,3], previousComponent:[0], parallelDepth:null},
	{id:2, type:"resistor2", voltage:0, resistance:1, current:0, nextComponent:[0], previousComponent:[1], parallelDepth:null},
	{id:3, type:"resistor3", voltage:0, resistance:1, current:0, nextComponent:[0], previousComponent:[1], parallelDepth:null},
]; //this will need a tidier function to sort objects into a list order to make them selectable and change the next and previous components to suit, eg if someone creates a load of components then deletes them it will throw the ids out of sync with the array index.

calcParallelDepths();
calcTotalVoltage();
calcTotalResistance();
addVoltageDrops();
calcCurrents();
printInfo();

function printInfo () {
	var component;
	process.stdout.write("type:" + '\t');
	process.stdout.write("voltage" + '\t');
	process.stdout.write("current" + '\t');
	process.stdout.write("resistance" + '\n');
	for (i = 0; i < componentArray.length; i++) {
		component = componentArray[i];
		// console.log(JSON.stringify(component));
		process.stdout.write(component.type + '\t');
		process.stdout.write(component.voltage + '\t');
		process.stdout.write(component.current + '\t');
		process.stdout.write(component.resistance + '\n');
	}
}

function calcCurrents() {
	var component;
	for (i = 0; i < componentArray.length; i++) {
		component = componentArray[i];
		if (component.voltage < 0 && component.resistance > 0) {
			component.current = -component.voltage / component.resistance;
		} else {
			component.current = 0;
		}
	}
}

function calcParallelDepths() { //start at component 0 and figure recursively
	var startComp = 0;
	component = componentArray[0];
	do {
		component.parallelDepth = 0;
		console.log("component = %s, parallelDepth = %j", component.type, component.parallelDepth);
		if (component.nextComponent.length > 1) {
			calcParallelDepthsHelper(1, component);
			component = componentArray[component.nextComponent[0]];
			while (component.parallelDepth != 0) {
				component = componentArray[component.nextComponent[0]]; //move past this parallel loop til the next individual component
			}
		} else {
			component = componentArray[component.nextComponent[0]];
		}
	} while(component.id != 0);
}

function calcParallelDepthsHelper(depth, component) {
	var origComponent = component;
	for (i = 0; i < origComponent.nextComponent.length; i++) {
		component = componentArray[origComponent.nextComponent[i]];
		while (component.parallelDepth == null) {
			component.parallelDepth = depth;
			console.log("component = %s, parallelDepth = %j", component.type, component.parallelDepth);
			if (component.nextComponent.length > 1) {
				calcParallelDepthsHelper(depth + 1, component);
				component = componentArray[component.nextComponent[0]];
				do {
					component = componentArray[component.nextComponent[0]]; //move past this parallel loop til the next individual component
				} while (component.parallelDepth == depth + 1)
			} else {
				component = componentArray[component.nextComponent[0]];
				if (component.previousComponent.length > 1 && i == origComponent.nextComponent.length - 1) {
					return;
				}
			}
		}
	}
}

function calcTotalVoltage() {
	var total = 0;
	for (i = 0; i < componentArray.length; i++) {
		if (componentArray[i].voltage > 0) {
			total += componentArray[i].voltage;
		}
	}
	console.log("total voltage = %j", total);
	return total;
}

function addVoltageDrops() {
	var voltage = calcTotalVoltage();
	while (component.parallelDepth == 0) {
		component.voltage = -voltage * component.resistance / findBranchResHelper(component); // set the voltage for the component you're on
		console.log("set component: %s voltage to : %j", component.type, component.voltage);
		if (component.nextComponent.length > 1) {
			console.log("component = %s", component.type);
			var initalComp = component;
			var parallelRes = findParallelCircuitResistance(component);
			var voltageToShare = voltage * parallelRes / calcTotalResistance();
			for (i = 0; i < initalComp.nextComponent.length; i++) {
				component = componentArray[initalComp.nextComponent[i]];
				console.log("L94 component = %s, voltage : %j, branchTotal: %j\n\n", component.type, voltageToShare, findBranchResHelper(component));
				addVoltageDropsHelper(voltageToShare, component);
			}
			while (component.parallelDepth > 0) {
				component = componentArray[component.nextComponent[0]];
			}
		} else {
			component = componentArray[component.nextComponent[0]];
		}
		if (component.id == 0) {
			break;
		}
	}
	// for (i = 0; i < componentArray.length; i++) {
	// 	console.log("component: %s, volatge: %j", componentArray[i].type, componentArray[i].voltage);
	// }
}


function addVoltageDropsHelper(voltageAvail, component) {
	var branchResistance = findBranchResHelper(component);
	console.log("entering addVoltageDropsHelper : volt %j, component %s, branchRes : %j", voltageAvail, component.type, branchResistance);
	var initialDepth = component.parallelDepth;
	while (component.parallelDepth == initialDepth) {
		component.voltage = -voltageAvail * component.resistance / branchResistance; // set the voltage for the component you're on
		if (component.nextComponent.length > 1) {
			var initalComp = component;
			var parallelRes = findParallelCircuitResistance(component);
			var voltageToShare = voltage * parallelRes / calcTotalResistance();
			for (i = 0; i < initalComp.nextComponent.length; i++) {
				component = componentArray[initalComp.nextComponent[i]];
				addVoltageDropsHelper(voltageToShare, component);
			}
			while (component.parallelDepth > initialDepth) {
				component = componentArray[component.nextComponent[0]];
			}
		} else {
			component = componentArray[component.nextComponent[0]];
		}
	}
}

function calcTotalResistance() {
	var total = componentArray[0].resistance;
	var component = componentArray[componentArray[0].nextComponent];
	while(component.id != 0) {
		total += component.resistance;
		console.log("current res total : %j, component name : %s", total, component.type);
		if (component.nextComponent.length > 1) {
			total += findParallelCircuitResistance(component);
			component = componentArray[component.nextComponent[0]];
			while (component.parallelDepth != 0) {
				component = componentArray[component.nextComponent[0]]; //move past this parallel loop til the next individual component
			}
			if (component.id = 0) {
				return total;
			}
		} else {
			component = componentArray[component.nextComponent[0]];
		}
	}
	console.log("total = %j", total);
	return total;
}


function findParallelCircuitResistance(component) {
	var total = 0;
	for (i = 0; i < component.nextComponent.length; i++) {
		total += 1 / findBranchResHelper(componentArray[component.nextComponent[i]]);
	}
	console.log("parallel res total = %j", 1 / total);
	return 1 / total;
}

function findBranchResHelper(component) {
	var originalDepth = component.parallelDepth;
	var total = 0;
	console.log("entering findBranchResHelper, component : %s", component.type);
	do {
		total += component.resistance;
		if (component.nextComponent.length > 1) {
			total += findParallelCircuitResistance(component);
			while (component.parallelDepth != originalDepth) {
				component = componentArray[component.nextComponent[0]];
			}
		} else {
			component = componentArray[component.nextComponent[0]];
		}
	} while (componentArray[component.nextComponent[0]].parallelDepth == originalDepth);
	console.log("in findBranchResHelper, originalDepth = %j, component = %s, total = %j", originalDepth, component.type, total);
	return total;
}
