//practical switches
const addToTable = document.getElementById('add-to-table');
const addNewUserButton = document.getElementById('addNewUserButton');
//schema inputs to database
const name = document.getElementById('name');
const surname = document.getElementById('surname');
const email = document.getElementById('email');
const date = document.getElementById('date');


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