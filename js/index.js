//Array interno y mostrado en pantalla
let globalArray = [];
let displayedArray = document.querySelector("#array");

//***** configuracion *****/
//Objeto config para uso de JSON y guardar configuraciones de usuario.
let config = {
    arrayLength: 30,
    darkMode : false,
    sorted: false
};

//Velocidad de ordenamiento del array
let speed = 75;

//Informacion capturada con fetch para visualizar en info
let sortingInfo;

//Fetch de info de archivo local
function getInfo() {
    fetch("/resources/sortingInfo.JSON")
        .then(response => response.json())
        .then(data => {
            sortingInfo = data.info;
        });
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
    renderArray(globalArray);
    matchDarkMode();
    getInfo();
}

//Colorea el array una vez ordenado
async function displaySortedState() {
    let arrayElements = document.querySelectorAll(".bar");

    for(let i = 0; i < arrayElements.length; i++) {
        arrayElements[i].style.backgroundColor = "cyan";
        await delay(25);
    }
    for(let i = 0; i < arrayElements.length; i++) {
        arrayElements[i].style.backgroundColor = "";
        await delay(25);
    }
}

//***** Protocolo de ordenamiento *****/
//Realiza las tareas necesarias al realizar el ordenamiento
async function sortProtocol(method) {
    globalArray = await method(globalArray, 0, globalArray.length - 1);
    config.sorted = true;
    displaySortedState();
    updateConfig();
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
    arrayElements.forEach(element => element.className = `${newClass}ArrayElement bar`);
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
function renderArray(array) {
    clearArray();

    let className = config.darkMode ? "darkArrayElement" : "lightArrayElement"

    for(let i = 0; i < array.length; i++) {
        let arrayElement = document.createElement("li");
        arrayElement.classList.add(className);
        arrayElement.classList.add("bar");
        arrayElement.style.height = array[i] + "px"
        displayedArray.appendChild(arrayElement);
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
    let info = document.createElement("div");
    info.innerHTML = `${sortingInfo}`;
    info.className = !config.darkMode ? "light" : "dark";
    document.querySelector("#info").append(info);
}

function hideInfo() {
    let mode = config.darkMode ? "dark" : "light";
    document.querySelector("#info").innerHTML = `<span class=${mode}>i</span>`;
}

function delay(ms) {
    return new Promise((response) => setTimeout(response, ms))
}

// ! EVENTOS
//***** Generar nuevo array *****/
document.getElementById("generate").addEventListener("click", () => {
        getConfig();
        globalArray = generateArray();
        renderArray(globalArray)
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
async function quickSort(array, start, end) {
    if (start >= end) {
        return;
    }
    let index = await partition(array, start, end);
    await quickSort(array, start, index - 1);
    await quickSort(array, index + 1, end);
}

async function partition(array, start, end) {
    let pivotIndex = start;
    let pivotValue = array[end];
    for (let i = start; i < end; i++) {
        if (array[i] < pivotValue) {
            await swapElements(array, i, pivotIndex);
            pivotIndex++;
        }
    }
    await swapElements(array, pivotIndex, end);
    return pivotIndex;
}

// ***** BubbleSort *****
async function bubbleSort(array) {
    //Iterar el array la cantidad de veces de su largo
    for (let i = 0; i < array.length; i++) {
        //Comparar elemento con elemento siguiente hasta terminar todo el array
        for (let j = 0; j < (array.length - i - 1); j++) {
            if (array[j] > array[j + 1]) {
                //Intercambiar elementos cuando el elemento en el indice mas chico es mas grande
                await swapElements(array, j, j + 1);
            }
        }
    }
    return array;
}

// ***** HeapSort ******
async function heapSort(array) {
    if (array.length < 2) return array;
    let arrayLength = array.length;

    //crear estructura de maxHeap (padre siempre mayor a hijos)
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        await sortParentAndChild(array, arrayLength, i);
    }

    //Cambiar el elemento raiz (el mas grande de todos) con el ultimo ordenado (el mas chico)
    for (let i = array.length - 1; i > 0; i--) {
        await swapElements(array, 0, i); //cambiar elementos
        arrayLength--;
        await sortParentAndChild(array, arrayLength, 0); //reestructurar el arbol sin el mas grande
    }
    return array;
}

async function sortParentAndChild(array, arrayLength, parentIndex) {
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
        await swapElements(array, parentIndex, maxIndex);
        //reconstruir estructura de maxHeap
        await sortParentAndChild(array, arrayLength, maxIndex);
    }
}

//Intercambiar elementos de array
async function swapElements(array, a, b) {
    await delay(speed);
    
    let arrayElements = document.querySelectorAll(".bar");

    for(let i = 0; i < arrayElements.length; i++) {
        if (i !== a && i !== b) arrayElements[i].style.backgroundColor = "";
    }
    let aux = array[a];
    
    array[a] = array[b];
    array[b] = aux;
    arrayElements[a].style.height = array[a] + "px";
    arrayElements[a].style.backgroundColor = "coral";
    arrayElements[b].style.height = array[b] + "px";
    arrayElements[b].style.backgroundColor = "coral";
}

//***** MergeSort *****//
async function mergeSort(array, flag) {
    if (array.length <= 1) return array;

    //Obtener el medio del array
    let middleIndex = Math.floor(array.length / 2);

    //Crear sub arrays (mitad y mitad)
    let leftArray = array.slice(0, middleIndex);
    let rightArray = array.slice(middleIndex);

    //Llamada recursiva para luego unirlos en rewind
    return await merge(await mergeSort(leftArray, true), await mergeSort(rightArray, false), middleIndex, flag);
}

//Unir sub arrays
async function merge(leftArray, rightArray, middleIndex, flag) {

    //Contadores de indices de arrays
    let mergedArray = [];
    let resultArray = [];

    //Iterar arrays hasta el final comparando valores componiendo el array combinado de ambos
    while (leftArray.length && rightArray.length) {
        if (leftArray[0] < rightArray[0]) {
            mergedArray.push(leftArray.shift());
        } else {
            mergedArray.push(rightArray.shift());
        }
        resultArray = [...mergedArray, ...leftArray.slice(), ...rightArray.slice()];
    }

    //Renderiza lado izquierdo o derecho (true/false)
    if (flag) await arrangeArray(resultArray, 0, middleIndex);
    else await arrangeArray(resultArray, middleIndex + 1, resultArray.length - 1);

    //Renderiza array competo
    await arrangeArray(resultArray,0,resultArray.length - 1);

    //Retornar array final y elementos restantes (en caso de no comparar) de izqueirda o derecha
    return resultArray;
}

//Muestra los pasos del merge sort, coloreando y estableciendo altura
async function arrangeArray(array, startIndex, endIndex){
    let arrayElements = document.querySelectorAll(".bar");
    for (let i = startIndex; i <= endIndex; i++) {
        await delay(speed);
        arrayElements[i].style.backgroundColor = "coral";
        arrayElements[i].style.height = array[i] + "px";
    }

    for(let i = startIndex; i <= endIndex; i++) {
        arrayElements[i].style.backgroundColor = "";
    }
}

//! INICIO DE PROGRAMA
initProtocol();