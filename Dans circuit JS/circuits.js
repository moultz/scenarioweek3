circuits.js

var componentCollection = [component {

}]

var component = {
	id : 1
	Type : "resistor"
	Voltage : 1
	Resistance : 1
	Nextcomponent : [2,3]
	previousComponent : [0]
	parallelDepth : 1
}

function calcResistance(component) {
	var total = 0;
	if (component.nextComponent.length > 1) {
		for (i = 0; i < component.nextComponent.length; i++) {
			total += 1/calcResistance(component.nextComponent[i]);
		}
		total = 1 / total;
	}
	return component.resistance;
}


function calcResistance(component) {
	var total = 0;
	if (component.parallelDepth > 0) {
		return component.resistance / findBranchResistance(component);
	} else {
		return component.resistance;
	}
}

function findBranchResistance(component) {
	var initialDepth = component.parallelDepth;
	var firstComponentInBranch;
	while (component.parallelDepth == initialDepth && initialDepth != 0) {
		firstComponentInBranch = component.id;
		component = componentArray[component.previousComponent];
	}

}


function findParallelCircuitResistance(component) {
	var total = 0;
	for (i = 0; i < component.nextComponent.length; i++) {
		total += findBranchResHelper(componentArray[component.nextComponent[i]]);
	}
	return 1 / total;
}

function findBranchResHelper(component) {
	var originalDepth = component.parallelDepth;
	var total = 0;
	while (componentArray[component.nextComponent[0]].parallelDepth >= originalDepth) {
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
}
