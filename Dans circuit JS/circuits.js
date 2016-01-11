circuits.js

var componentCollection = [component {

}]; //this will need a tidier function to sort objects into a list order to make them selectable and change the next and previous components to suit, eg if someone creates a load of components then deletes them it will throw the ids out of sync with the array index.

var component = {
	id : 1
	Type : "resistor"
	Voltage : 1
	Resistance : 1
	Nextcomponent : [2,3]
	previousComponent : [0]
	parallelDepth : 1
}

// function calcResistance(component) {
// 	var total = 0;
// 	if (component.nextComponent.length > 1) {
// 		for (i = 0; i < component.nextComponent.length; i++) {
// 			total += 1/calcResistance(component.nextComponent[i]);
// 		}
// 		total = 1 / total;
// 	}
// 	return component.resistance;
// }


// function calcResistance(component) {
// 	var total = 0;
// 	if (component.parallelDepth > 0) {
// 		return component.resistance / findBranchResistance(component);
// 	} else {
// 		return component.resistance;
// 	}
// }

// function findBranchResistance(component) {
// 	var initialDepth = component.parallelDepth;
// 	var firstComponentInBranch;
// 	while (component.parallelDepth == initialDepth && initialDepth != 0) {
// 		firstComponentInBranch = component.id;
// 		component = componentArray[component.previousComponent];
// 	}

// }


function calcTotalVoltage() {
	var total = 0;
	for (i = 0; i < componentArray.length; i++) {
		if (componentArray[i].Voltage > 0) {
			total += componentArray[i].Voltage;
		}
	}
	return total;
}

function calcTotalResistance() {
	var total = componentArray[0].resistance;
	var component = componentArray[0.nextComponent];
	while(component.nextComponent[0] != 0) {
		total += component.resistance;
		if (component.nextComponent.length > 1) {
			total += findParallelCircuitResistance(component);
			component = componentArray[component.nextComponent[0]];
			while (component.parallelDepth != 0) {
				component = componentArray[component.nextComponent[0]]; //move past this parallel loop til the next individual component
			}
			if (component.id = 0) {
				return total;
			}
		}
	}
	return total;
}

function addVoltageDrops(voltageAvail, component) {
	var branchResistance = findBranchResistance(component);
	var initialDepth = component.parallelDepth;
	while (component.parallelDepth >= initialDepth) {
		component.Voltage = voltageAvail * component.resistance / branchResistance; // set the voltage for the component you're on
		if (component.nextComponent.length > 1) {
			addVoltageDrops(voltageAvail * findParallelCircuitResistance(component) / branchResistance);
			while (component.parallelDepth > initialDepth) {
				component = componentArray[component.nextComponent[0]];
			}
		} else {
			component = componentArray[component.nextComponent[0]];
		}
	}
}

//ideal: Start from depth 0 and recusrsively calculate resistance from there.

// function findComponentResistance(component) {
// 	var originalDepth;
// 	while (componentArray[component.previousComponent[1]].parallelDepth  == originalDepth) { //find the first component on that branch
// 		component = componentArray[component.previousComponent[1]];
// 	}
// 	resistance = component.resistance = findBranchResHelper(component);

// 	while (component.parallelDepth > 0) {
// 		findParallelCircuitResistance
// 	}
// 	findParallelCircuitResistance
// }


function findParallelCircuitResistance(component) {
	var total = 0;
	for (i = 0; i < component.nextComponent.length; i++) {
		total += 1 / findBranchResHelper(componentArray[component.nextComponent[i]]);
	}
	return 1 / total;
}

function findBranchResHelper(component) {
	var originalDepth = component.parallelDepth;
	var total = 0;
	while (componentArray[component.nextComponent[0]].parallelDepth == originalDepth) {
		total += component.resistance;
		if (component.nextComponent.length > 1) {
			total += findParallelCircuitResistance(component);
			while (component.parallelDepth != originalDepth) {
				component = componentArray[component.nextComponent[0]];
			}
		} else {
			component = componentArray[component.nextComponent[0]];
		}
	}
	return total;
}
