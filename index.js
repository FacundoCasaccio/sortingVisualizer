let globalArray = []; //array en js que representa el array en pantalla
let config = {
    arrayLength: 30,  //largo del array que se muestra en pantalla
    darkMode: false
}

//Generar array aleatorio con largo especificado
function generateArray() {
    let array = [];

    //Numero random * 500 para tener la altura y +10 para que la altura no sea 0nunca
    for (let i = 0; i < config.arrayLength; i++) {
        array.push(Math.floor(Math.random() * 500) + 10);
    }

    return array;
}

//Algoritmos de ordenamiento

// ***** QuickSort *****
function quickSort(array) {

    if (array.length <= 1) {
        return array;
    }

    let pivot = array[Math.floor(array.length / 2)];
    //const pivot = array[array.length - 1];
    const leftArray = [];
    const rightArray = [];

    //iterar todos los elementos del array menos el pivot
    //los mas grandes o iguales van al array derecho y los mas chicos van al array izquierdo
    for (let element of array.slice(0, array.indexOf(pivot)).concat(array.slice(array.indexOf(pivot) + 1, array.length))) {
        element < pivot ? leftArray.push(element) : rightArray.push(element);
    }

    return [...quickSort(leftArray), pivot, ...quickSort(rightArray)];
}

// ***** BubbleSort *****
function bubbleSort(array) {

    //Iterar el array la cantidad de veces de su largo
    for (let i = 0; i < array.length; i++) {
        //Comparar elemento con elemento siguiente hasta terminar todo el array
        for (let j = 0; j < (array.length - i - 1); j++) {
            if (array[j] > array[j + 1]) {
                //Intercambiar elementos cuando el elemento en el indice mas chico es mas grande
                swapElements(array, j, j + 1);
            }
        }
    }

    return array;
}

// ***** HeapSort ******
function heapSort(array) {
    if (array.length < 2) return array;
    let arrayLength = array.length;

    //crear estructura de maxHeap (padre siempre mayor a hijos)
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        sortParentAndChild(array, arrayLength, i);
    }

    //Cambiar el elemento raiz (el mas grande de todos) con el ultimo ordenado (el mas chico)
    for(let i = array.length - 1; i > 0; i--) {
        swapElements(array, 0, i); //cambiar elementos
        arrayLength--;
        sortParentAndChild(array, arrayLength, 0); //reestructurar el arbol sin el mas grande
    }

    return array;
}

function sortParentAndChild(array, arrayLength, parentIndex) {
    //Hijos del arbol
    const leftIndex = (parentIndex * 2) + 1;
    const rightIndex = (parentIndex * 2) + 2;
    //Indice del mayor (inicializa como el padre que es la posicion final)
    let maxIndex = parentIndex;

    //Si existe hijo izquierdo y es mayor, reasignar indice del mayor
    if(leftIndex < arrayLength && array[leftIndex] > array[maxIndex]) maxIndex = leftIndex;

    //Si el hijo derecho existe y es mayor, reasignar indice del mayor
    if(rightIndex < arrayLength && array[rightIndex] > array[maxIndex]) maxIndex = rightIndex;

    //Si el padre no es el mayor
    if(maxIndex !== parentIndex) {
        //intercambiar valores
        swapElements(array, parentIndex, maxIndex);
        //reconstruir estructura de maxHeap
        sortParentAndChild(array, arrayLength, maxIndex);
    }
}

//Intercambiar elementos de array
function swapElements(array, a, b) {
    let aux = array[a];
    array[a] = array[b];
    array[b] = aux;
}

//***** MergeSort *****//
function mergeSort(array) {
    if (array.length <= 1) return array;

    //Obtener el medio del array
    let middleIndex = Math.floor(array.length / 2);

    //Crear sub arrays (mitad y mitad)
    let leftArray = array.slice(0, middleIndex);
    let rightArray = array.slice(middleIndex);

    //Llamada recursiva para luego unirlos en rewind
    return merge(mergeSort(leftArray), mergeSort(rightArray));
}

//Unir sub arrays
function merge (leftArray, rightArray) {
    //Contadores de indices de arrays
    let leftIndex = 0;
    let rightIndex = 0;
    let mergedArray = [];

    //Iterar arrays hasta el final comparando valores componiendo el array combinado de ambos
    while (leftIndex < leftArray.length && rightIndex < rightArray.length) {

        let leftElement = leftArray[leftIndex];
        let rightElement = rightArray[rightIndex];

        if (leftElement < rightElement) {
            mergedArray.push(leftElement);
            leftIndex++;
        } else {
            mergedArray.push(rightElement);
            rightIndex++;
        }
    }

    //Retornar array final y elementos restantes (en caso de no comparar) de izqueirda o derecha
    return [...mergedArray, ...leftArray.slice(leftIndex), ...rightArray.slice(rightIndex)];
}

//Mostrar array en pantalla
function displayArray(array) {
    clearArray(); //limpiar pantalla
    let list = document.querySelector("#array");
    let className;

    if (config.darkMode) className = "darkArrayElement"
    else className = "lightArrayElement"

    //Por cada elemento del array crear un li
    for(let element of array) {
        let li = document.createElement("li");
        li.className = className; //clase con propiedades de los elementos del array
        li.style = `height: ${element}px`; //estilo priopio de cada elemento (height representa el valor)
        li.innerHTML = element; //su valor interno para poder manipularlo 
        list.appendChild(li); //agregar a la lista
    }
}

//***** configuracion *****/
function updateConfig() {
    localStorage.setItem("config", JSON.stringify(config)); //Actualiza la configuracion modificada
}

function getConfig() {
    config = JSON.parse(localStorage.getItem("config")); //Obtiene la configuracion local del usuario
}

function initializeConfig() { //Inicializar configuracion

    let localConfig = JSON.parse(localStorage.getItem("config"));  //Configuracion local del usuario

    if (localConfig == undefined) localStorage.setItem("config", JSON.stringify(config)) //Inicializar en dafault
    else config = localConfig; //Inicializar con configuracion local
}

function matchSelectedLength() { //Iniciar con opcion guardada por usuario
    
    let optionIndex = (config.arrayLength / 10) - 1; //Indice de la opcion seleccionada en base a largo 
    let currentLength = document.querySelector("#length").getElementsByTagName("option")[optionIndex]; //Opcion a seleccionar

    currentLength.selected = true; //Dar atributo de seleccionada para que inicie
}

function matchDarkMode() { //sincronizar el tema con la configuracion previa del usuario
    if (config.darkMode) {
        //Seleccionar los elementos que por default son light en el html
        elements = document.querySelectorAll(`.light`);
        arrayElements = document.querySelectorAll(`.lightArrayElement`);
        
        //Cambiar clase de elementos
        elements.forEach( element => element.className = element.className.replace("light", "dark"));
        arrayElements.forEach( element => element.className = `darkArrayElement`);
    };
}

//***** Protocolo de inicio *****//
function initProtocol() { //protocolo de inicio. Cada vez que se abre hace las tareas necesarias
    initializeConfig(); //Inicializa configuracion
    matchSelectedLength(); //Corrige la opcion del select acorde a la longitud del array
    globalArray = generateArray(); //Genera un array en base a la longitud
    displayArray(globalArray); //Lo muestra en pantalla
    matchDarkMode(); //Sincroniza el tema con la configuracion
}

//Funcionalidad de UI
//***** aplicar modo oscuro *****//
function darkModeSwitch() {
    let elements, arrayElements; //elementos de interfaz y de array
    let newClass;
    let currentClass;
    let button = document.querySelector("#darkMode"); //boton de cambiar modo

    getConfig();  //obtiene la configuracion actual

    //cambiar las propiedades segun el modo 
    if (config.darkMode) { 
        currentClass = "dark";
        newClass = "light";
        button.innerHTML = "Dark Mode";
        config.darkMode = false;
    } else {
        currentClass = "light";
        newClass = "dark";
        button.innerHTML = "Light mode";
        config.darkMode = true;
    }

    updateConfig(); //actualizar informacion

    //Seleccionar los elementos segun el tema
    elements = document.querySelectorAll(`.${currentClass}`);
    arrayElements = document.querySelectorAll(`.${currentClass}ArrayElement`);
    
    //Cambiar clase de elementos
    elements.forEach( element => element.className = element.className.replace(currentClass, newClass));
    arrayElements.forEach( element => element.className = `${newClass}ArrayElement`);
}

//***** Limpiar array en pantalla *****//
function clearArray() {
    let list = document.querySelector("#array");
    list.innerHTML = ""; //borrar los li del array
}

//***** Generar nuevo array *****/
document.getElementById("generate").addEventListener("click", 
    () => { 
        getConfig();
        globalArray = generateArray(); //reasignar valor random
        displayArray(globalArray) //mostrar en pantalla
    });

//***** seleccionar largo array *****//
document.querySelector("#length").addEventListener ("change", () => {
    let selectedLenght = document.querySelector("#length").value;
    config.arrayLength = selectedLenght;
    updateConfig();
});

//***** Elegir algoritmo *****//
document.getElementById("quick").addEventListener("click", () => {
    globalArray = quickSort(globalArray); //ordenar
    displayArray(globalArray); //mostrar
});

document.getElementById("bubble").addEventListener("click", () => {
    globalArray = bubbleSort(globalArray); //ordenar
    displayArray(globalArray); //mostrar
});

document.getElementById("merge").addEventListener("click", () => { 
    globalArray = mergeSort(globalArray); //ordenar
    displayArray(globalArray); //mostrar
})

document.getElementById("heap").addEventListener("click", () => {
    globalArray = heapSort(globalArray); //ordenar
    displayArray(globalArray); //mostrar
})

//***** activar/desactivar modo oscuro *****//
document.querySelector("#darkMode").addEventListener("click", () => {
    darkModeSwitch();
})

initProtocol(); //Inicializar el programa



