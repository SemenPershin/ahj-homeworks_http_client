export class Notepad {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.notepad = undefined;
        this.addButton = undefined;
        this.ticketObj = {};
        this.ticketArr = [];

        this.addNotepad();
        this.getTicketsFromServer();
    }

    addNotepad() {
        this.notepad = document.createElement("div");
        this.notepad.classList.add("notepad");
        this.parentElement.append(this.notepad);

        this.addButton = document.createElement("div");
        this.addButton.classList.add("add_button");
        this.addButton.textContent = "Добавить тикет"
        this.notepad.append(this.addButton);

        this.addButton.addEventListener("click", () => {
            this.addTicket()
        })
    }

    addTicket() {
        const addTicketWindow = document.createElement("div");
        addTicketWindow.classList.add("add_ticket_Window");
        this.parentElement.append(addTicketWindow);

        const windowName = document.createElement("div");
        windowName.textContent = "Добавить тикет";
        addTicketWindow.append(windowName);

        const shortDescription = document.createElement("div");
        shortDescription.textContent = "Краткое описание";
        shortDescription.classList.add("description");
        addTicketWindow.append(shortDescription);

        const shortDescriptionInput = document.createElement("input");
        shortDescriptionInput.type = "text";
        shortDescriptionInput.classList.add("description_input");
        addTicketWindow.append(shortDescriptionInput);

        const longDescription = document.createElement("div");
        longDescription.textContent = "Подробное описание";
        longDescription.classList.add("description");
        addTicketWindow.append(longDescription);

        const longDescriptionInput = document.createElement("textarea");
        longDescriptionInput.classList.add("description_input");
        addTicketWindow.append(longDescriptionInput);

        const okCloseButtons = document.createElement("div");
        okCloseButtons.classList.add("ok_close_buttons")
        addTicketWindow.append(okCloseButtons);

        const okButton = document.createElement("div");
        okButton.textContent = "ОК"
        okCloseButtons.append(okButton);

        const closeButton = document.createElement("div");
        closeButton.textContent = "Отмена"
        okCloseButtons.append(closeButton);

        closeButton.addEventListener("click", () => {
            addTicketWindow.remove()
        })

        okButton.addEventListener("click", () => {

            if (shortDescriptionInput.value != "") {

                this.ticketObj.name = shortDescriptionInput.value;
                this.ticketObj.description = longDescriptionInput.value;
                this.ticketObj.status = false;
                const date = new Date();
                this.ticketObj.create = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
                this.ticketObj.id = undefined;

                addTicketWindow.remove()

                const xhr = new XMLHttpRequest();
                const createTicket = this.createTicket.bind(this)
                xhr.onreadystatechange = function (e) {
                    if (xhr.readyState != 4) return;
                    document.querySelectorAll(".ticket").forEach((element) => {
                        element.remove()
                    })
                    const arr = JSON.parse(xhr.response)
                    arr.forEach(element => {
                        createTicket(element.name, element.description, element.status, element.create, element.id)
                    });

                }

                xhr.open("POST", "http://localhost:7070/");

                xhr.send(JSON.stringify(this.ticketObj));
            } else {
                alert("Заполните поле краткого описания");
            }

        })
    }

    createTicket(name, description, status, create, id) {
        const ticket = document.createElement("div");
        ticket.classList.add("ticket");
        this.notepad.append(ticket);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = status;
        ticket.append(checkbox);

        const shortDescription = document.createElement("div");
        shortDescription.textContent = name;
        ticket.append(shortDescription);

        const date = document.createElement("div");
        date.textContent = create;
        ticket.append(date);

        const edit = document.createElement("div");
        edit.classList.add("ticket_button");
        edit.textContent = `\u{1F589}`;
        ticket.append(edit);

        const close = document.createElement("div");
        close.textContent = `\u{2A2F}`;
        close.classList.add("ticket_button");
        ticket.append(close);

        const longDescription = document.createElement("div");
        longDescription.textContent = description
        longDescription.classList.add("ticket_description", "disable");
        ticket.append(longDescription);

        this.ticketArr.push({ name: name, description: description, status: status, create: create, id: id, ticket: ticket })
        console.log(this.ticketArr)

        close.addEventListener("click", () => {
        
            const xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function (e) {
                if (xhr.readyState != 4) return;
                if (JSON.parse(xhr.response) == "OK") {
                    ticket.remove()
                }
            }

            xhr.open("POST", "http://localhost:7070/");

            this.ticketArr.forEach((element) => {
                if (ticket == element.ticket) {
                    xhr.send(JSON.stringify({ request: "DELETE", id: element.id }));
                    
                }
            })

           
        })

        edit.addEventListener("click", () => {
            this.editTicket(shortDescription, longDescription, ticket)
        })

        ticket.addEventListener("click", (event) => {
            if (event.target == ticket) {
                longDescription.classList.toggle("disable")
            }

        })

        checkbox.addEventListener("click", (event) => {
            event.preventDefault();

            const xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function (e) {
                if (xhr.readyState != 4) return;
                checkbox.checked = JSON.parse(xhr.response).status
            }

            xhr.open("POST", "http://localhost:7070/");

            this.ticketArr.forEach((element) => {
                if (ticket == element.ticket) {
                    xhr.send(JSON.stringify({ request: "STATUS", id: element.id }));
                }
            })
        })
    }

    editTicket(name, description, ticket) {
        const addTicketWindow = document.createElement("div");
        addTicketWindow.classList.add("add_ticket_Window");
        this.parentElement.append(addTicketWindow);

        const windowName = document.createElement("div");
        windowName.textContent = "Добавить тикет";
        addTicketWindow.append(windowName);

        const shortDescription = document.createElement("div");
        shortDescription.textContent = "Краткое описание";
        shortDescription.classList.add("description");
        addTicketWindow.append(shortDescription);

        const shortDescriptionInput = document.createElement("input");
        shortDescriptionInput.type = "text";
        shortDescriptionInput.value = name.textContent;
        shortDescriptionInput.classList.add("description_input");
        addTicketWindow.append(shortDescriptionInput);

        const longDescription = document.createElement("div");
        longDescription.textContent = "Подробное описание";
        longDescription.classList.add("description");
        addTicketWindow.append(longDescription);

        const longDescriptionInput = document.createElement("textarea");
        longDescriptionInput.value = description.textContent;
        longDescriptionInput.classList.add("description_input");
        addTicketWindow.append(longDescriptionInput);

        const okCloseButtons = document.createElement("div");
        okCloseButtons.classList.add("ok_close_buttons")
        addTicketWindow.append(okCloseButtons);

        const okButton = document.createElement("div");
        okButton.textContent = "ОК"
        okCloseButtons.append(okButton);

        const closeButton = document.createElement("div");
        closeButton.textContent = "Отмена"
        okCloseButtons.append(closeButton);

        closeButton.addEventListener("click", () => {
            addTicketWindow.remove()
        })

        okButton.addEventListener("click", (event) => {
            
            console.log(ticket)
            if (shortDescriptionInput.value != "") {

                const xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function (e) {
                    if (xhr.readyState != 4) return;
                    if (JSON.parse(xhr.response) == "OK") {
                        name.textContent = shortDescriptionInput.value;
                        description.textContent = longDescriptionInput.value;
                        addTicketWindow.remove()
                    }
                }
    
                xhr.open("POST", "http://localhost:7070/");
    
                this.ticketArr.forEach((element) => {
                    console.log(1)
                    if (ticket == element.ticket) {
                        xhr.send(JSON.stringify({ request: "EDIT", id: element.id, name: shortDescriptionInput.value, description: longDescriptionInput.value}));
                    }
                })

              

                
            } else {
                alert("Заполните поле краткого описания");
            }

        })
    }

    getTicketsFromServer() {
        const xhr = new XMLHttpRequest();
        const createTicket = this.createTicket.bind(this)

        xhr.onreadystatechange = function (e) {
            if (xhr.readyState != 4) return;
            const arr = JSON.parse(xhr.response)
            arr.forEach(element => {
                createTicket(element.name, element.description, element.status, element.create, element.id)
            });
        }

        xhr.open("POST", "http://localhost:7070/");

        xhr.send(JSON.stringify("GET TICKET"));

    }

}