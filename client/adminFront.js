//practical switches
const addToTable = document.getElementById('add-to-table');
const addNewUserButton = document.getElementById('addNewUserButton');
/*const editUserButton = document.getElementById('editUserButton');*/
//schema inputs to database
const name = document.getElementById('name');
const surname = document.getElementById('surname');
const email = document.getElementById('email');
const date = document.getElementById('date');


const insertEditForm = document.getElementById('insert-edit-form');
/*const nameEdit = document.getElementById('name-edit');
const surnameEdit = document.getElementById('surname-edit');
const emailEdit = document.getElementById('email-edit');
const dateEdit = document.getElementById('date-edit');*/
/*const editForm = document.getElementById(`edit-form`);*/

// init values
let isEditFormShown = false;


document.addEventListener('DOMContentLoaded', async () => {
    const response = await axios.get('/getItems');

    for (let i = 0; i <= response.data.length - 1; ++i){

        const currentID = response.data[i]._id;
        console.log(currentID);
        //console.log(Date.parse(response.data[i].date));

        const newRow = `<tr>
                        <td>${response.data[i]._id}</td>
                        <td>${response.data[i].name}</td>
                        <td>${response.data[i].surname}</td>
                        <td>${response.data[i].email}</td>
                        <td>${new Date(response.data[i].date).toLocaleDateString('en-us', { year:"numeric", month:"short", day: "numeric"})}</td>
                        <td><button id="edit--${i}" class="button--white--border" onclick="toggleEditUserForm('${currentID}')">Edit</button>
                        <button id="delete--${i}" class="button--white--border" onclick="deleteUser('${currentID}')">Delete</button></td>
                       
                    </tr>`

        addToTable.insertAdjacentHTML('afterend', newRow);
    }
});


const checkIfEmail = (input) => {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegEx.test(input);
}

//adding new data to database
addNewUserButton.addEventListener('click', async () => {
    const item = {
        name: name.value,
        surname: surname.value,
        email: email.value,
        date: date.value,
    }

    if (checkIfEmail(item.email)) {

        await axios.post("/addItem", {
            data: item
        });

        document.location.reload();

    } else {
        alert('Wrong email format');
    }
});


// check if form is shown already
const toggleEditUserForm = (id) => {
    if(!isEditFormShown){
        insertForm(id);
        isEditFormShown = true;
    } else {
        removeForm();
    }
    console.log(id);
};
//insert edit form
const insertForm = () => {
    const editForm = `<div id="edit-form" class="content color--admin rounded-border">
                    <h2>Edit certificate</h2>
                    <div class="form">
                        <label for="name">name:</label><br>
                        <input type="text" id="name-edit"><br>
                        <label for="surname">surname:</label><br>
                        <input type="text" id="surname-edit"><br>
                        <label for="email">Email:</label><br>
                        <input type="email" id="email-edit"><br>
                        <label for="date">Date:</label><br>
                        <input type="date" id="date-edit" min="1914" max="2023"><br><br>
    
                        <button id="editUserButton" class="pointer button--white">Edit certificate</button>
                    </div>
                </div>`

    insertEditForm.insertAdjacentHTML('afterend', editForm);
};
// remove edit form
const removeForm = () => {
    const element = document.getElementById('edit-form');
    element.remove();
    isEditFormShown = false;
};



/*const editUser = async(id) => {
    console.log(id);
    const item = {
        name: nameEdit.value,
        surname: surnameEdit.value,
        email: emailEdit.value,
        date: dateEdit.value
    }
    await axios.put(`/editItem/${id}`, {
        data: item
    })
        .catch(error => console.error(error));

    document.location.reload();
};

editUserButton.addEventListener('click', () => {
    editUser();
})*/


//Delete item
const deleteUser = (id) => {
    console.log(`deleted: ${id}`)
    axios
        .delete(`/deleteItem/${id}`)
        .then(response => {
            console.log(`user is removed`, id)
        })
        .catch(error => console.error(error))

    document.location.reload();
}