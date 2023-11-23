//practical switches
const addToTable = document.getElementById('add-to-table');
const addNewUserButton = document.getElementById('addNewUserButton');
const insertBirthdayNot = document.getElementById('insert-birthday-notification');
//schema inputs to database
const name = document.getElementById('name');
const surname = document.getElementById('surname');
const email = document.getElementById('email');
const date = document.getElementById('date');




const sendBirthdayMail = async(id) => {
    const message = {
        from: '', //sender email
        to: "",  //receiver email
        subject: "simulation of congratulation proj",
        text: "Happy Birthday! Only today get a discount 25% on our service!"
    }
    console.log(message);
    await axios.post("/birthday", {
        data: message
    })
};

//insert birthday notification
const insertBirthdayAlert = (items) => {
    const currentID = items._id;
    console.log(`it's ${items.name} ${items.surname} Birthday today!`);
    const birthdayAlert = `<div class="birthday-alert">
                It's ${items.name} ${items.surname} Birthday today!  Send greetings via:
                <button id="send-greetings--${currentID}" class="button--noborder" ><img class="icon--mail" src="images/icons8-mail-50.png" alt="send mail" onclick="sendBirthdayMail('${currentID}')"></button>
                                  </div>`

    insertBirthdayNot.insertAdjacentHTML('afterend', birthdayAlert);
}
// Business function (checks if its client's birthday)day
const ifBirthday = (items) => {
    //--today date generator--
    const todayDate = new Date().toLocaleDateString('en-us', { year:"numeric", month:"short", day: "numeric"});
    console.log(`today is ${todayDate}`);
    for (let i = 0; i <= items.length - 1; ++i) {
        //--current date from database looped obj--
        const currentDateOfBirth = new Date(items[i].date).toLocaleDateString('en-us', { year:"numeric", month:"short", day: "numeric"});
        if(todayDate === currentDateOfBirth) {
            insertBirthdayAlert(items[i]);
        } else {
            //insertNoBirthdayAlert();
        }
    }
};

//insert items to the page with VUE
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
        }
    },
    mounted() {
        this.fetchItems();
    }
});
app.mount('#app');

//when page is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const response = await axios.get('/getItems');
    const items = response.data;

    //insertItemsWhenPageIsLoaded(response);
    ifBirthday(items);
});


const checkIfEmail = (input) => {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegEx.test(input);
};

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