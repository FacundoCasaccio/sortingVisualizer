//Array mostrado en pantalla
let globalArray = [];

//***** configuracion *****/
//Objeto config para uso de JSON y guardar configuraciones de usuario.
let config = {
    arrayLength: 30,
    darkMode : false,
    sorted: false
};

let sortingInfo;

function getInfo() {
    fetch("/resources/sortingInfo.JSON")
        .then(response => response.json())
        .then(data => {
            sortingInfo = data.info;
        });
}

function setConfig(configuration) {
    config = configuration;
}

//Actualiza la configuracion en local storage
function updateConfig() {
    localStorage.setItem("config", JSON.stringify(config));
}

//Obtiene la configuracion del local storage
function getConfig() {
    config = JSON.parse(localStorage.getItem("config"));
}

//Inicializar configuracion
function initializeConfig() {
    //Obtener configuracion local
    let localConfig = JSON.parse(localStorage.getItem("config"));

    //Inicializar configuracion default o almacenada en local storage
    localConfig == undefined ? localStorage.setItem("config", JSON.stringify(config)) : config = localConfig;
}

//! PROTOCOLOS
//***** Protocolo de inicio (tareas necesarias al ejecutar) *****//
function initProtocol() {
    initializeConfig();
    matchSelectedLength();
    globalArray = generateArray();
    displayArray(globalArray);
    matchDarkMode();
    getInfo();
}

//Realiza las tareas necesarias al realizar el ordenamiento
function sortProtocol(method) {
    globalArray = method(globalArray);
    config.sorted = true;
    updateConfig();
    displayArray(globalArray);
}

//***** Sincronizar select *****//
function matchSelectedLength() {
    //Indice de la opcion seleccionada en base a largo 
    let optionIndex = (config.arrayLength / 10) - 1;

    //Obtener la opcion correspondiente al largo y marcarla como seleccionada
    let currentLength = document.querySelector("#length").getElementsByTagName("option")[optionIndex];
    currentLength.selected = true;
}

//***** Sincronizar tema *****//
function matchDarkMode() {
    if (config.darkMode) {
        //Seleccionar los elementos que por default son light en el html
        elements = document.querySelectorAll(`.light`);
        arrayElements = document.querySelectorAll(`.lightArrayElement`);

        //Cambiar clase de elementos
        elements.forEach(element => element.className = element.className.replace("light", "dark"));
        arrayElements.forEach(element => element.className = `darkArrayElement`);

        //Actualizar texto de boton
        document.querySelector("#darkMode").innerHTML = "Light Mode"
    };
}

//***** aplicar modo oscuro *****//
function darkModeSwitch() {
    let elements, arrayElements, newClass, currentClass;
    let button = document.querySelector("#darkMode");

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

    updateConfig();

    //Seleccionar los elementos
    elements = document.querySelectorAll(`.${currentClass}`);
    arrayElements = document.querySelectorAll(`.${currentClass}ArrayElement`);

    //Cambiar tema
    elements.forEach(element => element.className = element.className.replace(currentClass, newClass));
    arrayElements.forEach(element => element.className = `${newClass}ArrayElement`);
}

//! MANIPULACION DE ARRAY EN PANTALLA

//***** Generar array aleatorio *****//
function generateArray() {
    let array = [];

    for (let i = 0; i < config.arrayLength; i++) {
        array.push(Math.floor(Math.random() * 500) + 10);
    }

    config.sorted = false;
    updateConfig();

    return array;
}

//***** Mostrar array en pantalla *****//
function displayArray(array) {
    clearArray();

    let list = document.querySelector("#array");

    let className = config.darkMode ? "darkArrayElement" : "lightArrayElement"

    //Crear li por elemento de array y asignarle propiedades para ver en pantalla
    for (let element of array) {
        let li = document.createElement("li");
        li.className = className;
        li.style = `height: ${element}px`;
        li.innerHTML = element;
        list.appendChild(li);
    }
}

//***** Borrar array en pantalla *****//
function clearArray() {
    document.querySelector("#array").innerHTML = "";
}

// ! TOASTIFY 
function alreadySortedToast() {
    let style = config.darkMode ? 
    {background: "#212121", color: "white", shadow: "none"} : {background: "white", color: "#212121"};

    Toastify({
        text: "The array is already sorted",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "left",
        stopOnFocus: true,
        style: style,
    }).showToast();
}

function showInfo() {
    let info = `<p>${sortingInfo}</p>`
    document.querySelector("#info").append(info);
}

function hideInfo() {
    let mode = config.darkMode ? "dark" : "light";
    document.querySelector("#info").innerHTML = `<span class=${mode}>i</span>`;
}

// ! EVENTOS
//***** Generar nuevo array *****/
document.getElementById("generate").addEventListener("click", () => {
        getConfig();
        globalArray = generateArray();
        displayArray(globalArray)
    });

//***** seleccionar largo array *****//
document.querySelector("#length").addEventListener("change", () => {
    let selectedLenght = document.querySelector("#length").value;
    config.arrayLength = selectedLenght;
    updateConfig();
});

//***** Mostrar info *****//
document.querySelector("#info").addEventListener("mouseover", () => {
    showInfo();
});

document.querySelector("#info").addEventListener("mouseout", () => {
    hideInfo();
});

//***** Elegir algoritmo *****//
document.getElementById("quick").addEventListener("click", () => {
    config.sorted ? alreadySortedToast() : sortProtocol(quickSort);
});

document.getElementById("bubble").addEventListener("click", () => {
    config.sorted ? alreadySortedToast() : sortProtocol(bubbleSort);
});

document.getElementById("merge").addEventListener("click", () => {
    config.sorted ? alreadySortedToast() : sortProtocol(mergeSort);
})

document.getElementById("heap").addEventListener("click", () => {
    config.sorted ? alreadySortedToast() : sortProtocol(heapSort);
})

//***** activar/desactivar modo oscuro *****//
document.querySelector("#darkMode").addEventListener("click", () => {
    darkModeSwitch();
})

//! ALGORITMOS DE ORDENAMIENTO

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
    for (let i = array.length - 1; i > 0; i--) {
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
    if (leftIndex < arrayLength && array[leftIndex] > array[maxIndex]) maxIndex = leftIndex;

    //Si el hijo derecho existe y es mayor, reasignar indice del mayor
    if (rightIndex < arrayLength && array[rightIndex] > array[maxIndex]) maxIndex = rightIndex;

    //Si el padre no es el mayor
    if (maxIndex !== parentIndex) {
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
function merge(leftArray, rightArray) {
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

//! INICIO DE PROGRAMA
initProtocol();