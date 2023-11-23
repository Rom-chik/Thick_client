//practical switches
const addToTable = document.getElementById('add-to-table');
const addNewUserButton = document.getElementById('addNewUserButton');
const insertEditForm = document.getElementById('insert-edit-form');
//schema inputs to database
const name = document.getElementById('name');
const surname = document.getElementById('surname');
const email = document.getElementById('email');
const date = document.getElementById('date');

// init values
let isEditFormShown = false;



//insert items to the page, delete, edit items with VUE
const app = Vue.createApp({
    data() {
        return {
            items: []
        };
    },
    methods: {
        async fetchItems() {
            try {
                const response = await axios.get('/getItems');
                this.items = response.data;
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" });
        },
        toggleEditUserForm(id) {
            // Implement the logic to toggle the edit user form
            if(!isEditFormShown){
                insertForm(id);
                isEditFormShown = true;
            } else {
                removeForm();
            }
            console.log('Edit:', id);
        },
        deleteUser(id) {
            // Implement the logic to delete the user
            axios
                .delete(`/deleteItem/${id}`)
                .then(response => {
                    console.log(`user is removed`, id)
                })
                .catch(error => console.error(error))

            document.location.reload();
            console.log('Delete:', id);
        }
    },
    mounted() {
        this.fetchItems();
    }
});
app.mount('#app');


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


// edit button
const editUserForm = async(id) => {
    console.log(`edited id: ${id}`);
    const item = {
        name: document.getElementById(`name--${id}`).value,
        surname: document.getElementById(`surname--${id}`).value,
        email: document.getElementById(`email--${id}`).value,
        date: document.getElementById(`date--${id}`).value
    }
    await axios.put(`/editItem/${id}`, {
        data: item
    })
        .catch(error => console.error(error));

    document.location.reload();
}

// remove edit form
const removeForm = () => {
    const element = document.getElementById('edit-form');
    element.remove();
    isEditFormShown = false;
};

//insert edit form
const insertForm = (id) => {
    const editForm = `<div id="edit-form" class="content color--admin rounded-border">
                    <h2>Edit certificate</h2>
                    <div class="form">
                        <label for="name">name:</label><br>
                        <input type="text" id="name--${id}"><br>
                        <label for="surname">surname:</label><br>
                        <input type="text" id="surname--${id}"><br>
                        <label for="email">Email:</label><br>
                        <input type="email" id="email--${id}"><br>
                        <label for="date">Date:</label><br>
                        <input type="date" id="date--${id}" min="1914" max="2023"><br><br>
    
                        <button id="editUserButton" class="pointer button--white" onclick="editUserForm('${id}')">Edit certificate</button>
                    </div>
                </div>`

    insertEditForm.insertAdjacentHTML('afterend', editForm);
};