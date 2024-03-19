//Global Variables 
let apiName = 'laptop'
const sidebarHTML2 = document.querySelector('.side-bar-content-inner');
const editFormDiv = document.querySelector('.edit-form');
const detailModalDiv = document.querySelector('.modal-detail');
const createForm = document.querySelector('.create-form');
const addProduct = document.querySelector('.add-product-button');


//Data API 1
const BASE_API = 'https://65f3e8f6105614e654a165a9.mockapi.io/api';


const handleCreate = () => {
    if (apiName === 'laptop') {
        showCreateLaptopForm();

    } else {
        showCreateMonitorForm();

    }
}


const getLaptopAPI = async () => {
    const response = await fetch(`${BASE_API}/laptop`);
    const data = await response.json();
    return data;
}
 
const getLaptopById = async (laptopId) => {
    const response = await fetch(`${BASE_API}/laptop/${laptopId}`);
    const data = await response.json();
    return data;
}

const editLaptop = async (updatedLaptop) => {
    const response = await fetch(`${BASE_API}/laptop/${updatedLaptop.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedLaptop)
    });
    return response.json();
}

const createLaptop = async (newLaptop) => {
    const response = await fetch(`${BASE_API}/laptop`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLaptop)
    });
    return response.json();
}

const deleteLaptop = async (laptopId) => {
    console.log(laptopId);
    const response = await fetch(`${BASE_API}/laptop/${laptopId}`, {
        method: 'DELETE'
    });
    return response.json();
}

function handleGetAPI1() {
    apiName = 'laptop';
    sidebarHTML2.innerHTML = `<h1><strong>Loading....</strong></h1>`;

    getLaptopAPI()
        .then((data) => {
            sidebarHTML2.innerHTML = CreateLaptopCardList(data);
        })
        .catch((error) => {
            console.log(error);
            sidebarHTML2.innerHTML = `<h1><strong>Something went wrong</strong></h1>`;
        });
}

function GenerateLaptopCard(laptop) {
    return `
    <div class="laptop-card">
        <hr />
        <img class='laptop-image' src="${laptop.image}">
        <div class="container">
            <h4>Name: ${laptop.productName}</h4>
            <p>Price: ${laptop.price}</p>
        </div>
        <div class='laptop-actions'>
            <button onclick='openProductDetailModal(${laptop.id})' class="laptop-btn">ViewDetail</button>
            <button onclick="handleOpenEditForm(${laptop.id})" class="laptop-btn">Edit</button>
            <button onclick="handleDeleteLaptop(${laptop.id})" class="laptop-btn">Delete</button>
        </div>
    </div>
    `;
};

const handleDeleteLaptop = async (laptopId) => {
    const isDeleted = await deleteLaptop(laptopId);

    if (!isDeleted) {
        const laptopListDiv = document.querySelector('.laptop-card-list');
        const errorLaptop = document.createElement('h2');
        errorLaptop.innerHTML = 'Something went wrong';
        errorLaptop.style.color = 'red';
        laptopListDiv.appendChild(errorLaptop);
    } else {
        handleGetAPI1()
    }
}

const handleEditLaptopForm = () =>{
    const editFormDiv = document.querySelector('.edit-form');
    editFormDiv.style.display = 'flex';
}

const handleCancelEdit = () => {
    editFormDiv.style.display = 'none';
}

const handleOpenEditForm = async (laptopId) => {
    editFormDiv.style.display = 'flex';
    editFormDiv.innerHTML = `<h1>Loading....</h1>`;

    const laptopdetail = await getLaptopById(laptopId);

    console.log({laptopdetail});

    editFormDiv.innerHTML = `
    <div class="modal-content">
        <h2>Edit Product</h2>
        <input class='edit-product-name' value='${laptopdetail.productName}' />
        <input class='edit-product-price' value='${laptopdetail.price}' />
        <input class='edit-product-image' value='${laptopdetail.image}' />
        <button onclick='handleCancelEdit()' class='button-edit'>Cancel</button>
        <button onclick='handleEditProduct(${laptopdetail.id})' class='button-edit'>Edit</button>
    </div>
    `;
};

const handleEditProduct = async (laptopId) => {
    const productName = document.querySelector('.edit-product-name').value;
    const price = document.querySelector('.edit-product-price').value;
    const image = document.querySelector('.edit-product-image').value;

    const updatedLaptop = {
        id: laptopId,
        productName,
        price,
        image
    }

    const isUpdated = await editLaptop(updatedLaptop);

    if (!isUpdated) {
        const laptopListDiv = document.querySelector('.laptop-card-list');
        const errorLaptop = document.createElement('h2');
        errorLaptop.innerHTML = 'Something went wrong';
        errorLaptop.style.color = 'red';
        laptopListDiv.appendChild(errorLaptop);
    } else {
        handleGetAPI1()
        handleCancelEdit()
    }
}

const handleCreateProduct = async () => {
    const productName = document.querySelector('#create-product-name').value;
    const price = document.querySelector('#create-product-price').value;
    const image = document.querySelector('#create-product-img').value;

    const newLaptop = {
        productName,
        price,
        image
    }

    console.log({newLaptop});

    const isCreated = await createLaptop(newLaptop);

    if (!isCreated) {
        const laptopListDiv = document.querySelector('.laptop-card-list');
        const errorLaptop = document.createElement('h2');
        errorLaptop.innerHTML = 'Something went wrong';
        errorLaptop.style.color = 'red';
        laptopListDiv.appendChild(errorLaptop);
    } else {
        handleGetAPI1()
        closeCreateLaptopForm()
    }
}

const showCreateLaptopForm = () => {
    createForm.style.visibility = 'visible';
}

const closeCreateLaptopForm = () => {
    createForm.style.visibility = 'hidden';
}

function CreateLaptopCardList(laptops) {
    return `
    <div class="laptop-card-list">
        ${laptops.map((laptop, index) => GenerateLaptopCard(laptop, index))}
    </div>    
    `
}

const openProductDetailModal = async (laptopId) => {
    detailModalDiv.style.display = 'flex';
    detailModalDiv.innerHTML = `<h1>Loading....</h1>`;

    const laptopdetail = await getLaptopById(laptopId);

    console.log({laptopdetail});

    detailModalDiv.innerHTML = `
    <div class="modal-content">
        <h2>Product Detail</h2>
        <img class='modal-product-image' src='${laptopdetail.image}' />
        <p>Name: ${laptopdetail.productName}</p>
        <p>Price: ${laptopdetail.price}</p>
        <button onclick='closeProductDetailModal()' class='close-modal'>Close</button>
    </div>
    `;
};

const closeProductDetailModal = () => {
    detailModalDiv.style.display = 'none';
};


//Data API 2

const getMonitor = async () => {
    const response = await fetch(`${BASE_API}/monitor`);
    const data = await response.json();
    return data;
}

const getMonitorById = async (monitorId) => {
    const response = await fetch(`${BASE_API}/monitor/${monitorId}`);
    const data = await response.json();
    return data;
}

const editMonitor = async (updatedMonitor) => {
    const response = await fetch(`${BASE_API}/monitor/${updatedMonitor.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMonitor)
    });
    return response.json();
}

const createMonitor = async (newMonitor) => {
    const response = await fetch(`${BASE_API}/monitor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMonitor)
    });
    return response.json();
}

const deleteMonitor = async (monitorId) => {
    console.log(monitorId);
    const response = await fetch(`${BASE_API}/monitor/${monitorId}`, {
        method: 'DELETE'
    });
    return response.json();
}

function handleGetAPI2() {
    apiName = 'monitor';
    sidebarHTML2.innerHTML = `<h1><strong>Loading....</strong></h1>`;

    getMonitor()
        .then((data) => {
            sidebarHTML2.innerHTML = CreateMonitorCardList(data);
        })
        .catch((error) => {
            console.log(error);
            sidebarHTML2.innerHTML = `<h1><strong>Something went wrong</strong></h1>`;
        });
}

function GenerateMonitorCard(monitor) {
    return `
    <div class="monitor-card">
        <hr />
        <img class='monitor-image' src="${monitor.monitorImage}">
        <div class="container">
            <h4>Name: ${monitor.monitorName}</h4>
            <p>Price: ${monitor.monitePrice}</p>
        </div>
        <div class='monitor-actions'>
            <button onclick='openMonitorDetailModal(${monitor.id})' class="monitor-btn">ViewDetail</button>
            <button onclick="handleMonitorEditForm(${monitor.id})" class="monitor-btn">Edit</button>
            <button onclick="handleDeleteMonitor(${monitor.id})" class="monitor-btn">Delete</button>
        </div>
    </div>
    `;
};


const handleDeleteMonitor = async (monitorId) => {
    const isDeleted = await deleteMonitor(monitorId);

    if (!isDeleted) {
        const monitorListDiv = document.querySelector('.monitor-card-list');
        const errorMonitor = document.createElement('h2');
        errorMonitor.innerHTML = 'Something went wrong';
        errorMonitor.style.color = 'red';
        monitorListDiv.appendChild(errorMonitor);
    } else {
        handleGetAPI2()
    }
}


const handleEditMonitorForm = () =>{
    const editFormDiv = document.querySelector('.edit-form');
    editFormDiv.style.display = 'flex';
}

const handleMonitorEditForm = async (monitorId) => {
    editFormDiv.style.display = 'flex';
    editFormDiv.innerHTML = `<h1>Loading....</h1>`;

    const monitordetail = await getMonitorById(monitorId);

    console.log({monitordetail});

    editFormDiv.innerHTML = `
    <div class="modal-content">
        <h2>Edit Product</h2>
        <input class='edit-product-name' value='${monitordetail.monitorName}' />
        <input class='edit-product-price' value='${monitordetail.price}' />
        <input class='edit-product-image' value='${monitordetail.monitorImage}' />
        <button onclick='handleCancelEdit()' class='button-edit'>Cancel</button>
        <button onclick='handleEditMonitor(${monitordetail.id})' class='button-edit'>Edit</button>
    </div>
    `;
};

const handleEditMonitor = async (monitorId) => {
    const monitorName = document.querySelector('.edit-product-name').value;
    const price = document.querySelector('.edit-product-price').value;
    const monitorImage = document.querySelector('.edit-product-image').value;

    const updatedMonitor = {
        id: monitorId,
        monitorName,
        price,
        monitorImage
    }

    const isUpdated = await editMonitor(updatedMonitor);

    if (!isUpdated) {
        const monitorListDiv = document.querySelector('.monitor-card-list');
        const errorMonitor = document.createElement('h2');
        errorMonitor.innerHTML = 'Something went wrong';
        errorMonitor.style.color = 'red';
        monitorListDiv.appendChild(errorMonitor);
    } else {
        handleGetAPI2()
        handleCancelEdit()
    }
}

const handleCreateMonitor = async () => {
    const monitorName = document.querySelector('#create-product-name').value;
    const price = document.querySelector('#create-product-price').value;
    const monitorImage = document.querySelector('#create-product-img').value;

    const newMonitor = {
        monitorName,
        price,
        monitorImage
    }

    console.log({newMonitor});

    const isCreated = await createMonitor(newMonitor);

    if (!isCreated) {
        const monitorListDiv = document.querySelector('.monitor-card-list');
        const errorMonitor = document.createElement('h2');
        errorMonitor.innerHTML = 'Something went wrong';
        errorMonitor.style.color = 'red';
        monitorListDiv.appendChild(errorMonitor);
    } else {
        handleGetAPI2()
        closeCreateLaptopForm()
    }
}

const showCreateMonitorForm = () => {
    createForm.style.visibility = 'visible';
}

const openMonitorDetailModal = async (monitorId) => {
    detailModalDiv.style.display = 'flex';
    detailModalDiv.innerHTML = `<h1>Loading....</h1>`;

    const monitordetail = await getMonitorById(monitorId);

    console.log({monitordetail});

    detailModalDiv.innerHTML = `
    <div class="modal-content">
        <h2>Product Detail</h2>
        <img class='modal-product-image' src='${monitordetail.monitorImage}' />
        <p>Name: ${monitordetail.monitorName}</p>
        <p>Price: ${monitordetail.monitePrice}</p>
        <button onclick='closeProductDetailModal()' class='close-modal'>Close</button>
    </div>
    `;
};

function CreateMonitorCardList(monitors) {
    return `
    <div class="monitor-card-list">
        ${monitors.map((monitor, index) => GenerateMonitorCard(monitor, index))}
    </div>    
    `
}
