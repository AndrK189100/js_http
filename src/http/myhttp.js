import "./myhttp.css";
import {addForm, editForm, deleteForm, myHttp} from "./template.js";

export default class MyHttp {
   
    static #http;
    static #listTickets;
        
    static init(container) {

        container.insertAdjacentHTML('beforeEnd', myHttp)
        
        this.#http = container.querySelector('.http');
        this.#listTickets = this.#http.querySelector('.tickets-list');

        this.#http.querySelector('.add-ticket-button').onclick = this.showAddTicket;
        this.#listTickets.addEventListener('click', this.showDeleteTicket);
        this.#listTickets.addEventListener('click', this.showDetailTicket);
        this.#listTickets.addEventListener('click', this.setStatusTicket);
        this.#listTickets.addEventListener('click', this.showEditTicket);

        this.loadTickets();
    }

    static showAddTicket() {
        
        document.body.insertAdjacentHTML('beforeend', addForm);
        const addTicket = document.body.querySelector('.add-ticket');
        
        addTicket.querySelector('.ticket-cancel-button').onclick = (evt) => {
            evt.preventDefault();
            document.body.querySelector('.modal').remove();
        }

        addTicket.querySelector('.ticket-add-button').onclick = MyHttp.addTicketToList;
    }

    static addTicketToList(evt) {

        evt.preventDefault();

        const addTicket = document.body.querySelector('.add-ticket')

        const shortDescribe = addTicket.querySelector('.ticket-short-describe');
        const longDescribe = addTicket.querySelector('.ticket-long-describe');
        const date = new Date();
        const timeStamp = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' '
                            + date.getHours() + ':' + date.getMinutes();
                            
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
        if(xhr.readyState !== 4) {
            return;
            }
        }
        
        xhr.open('POST', 'http://localhost:7070?method=createTicket');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        const body = `name=${encodeURIComponent(shortDescribe.value)}&` +
                        `discribe=${encodeURIComponent(longDescribe.value)}&timestamp=${encodeURIComponent(timeStamp)}`;
        xhr.send(body);

        xhr.onload = () => {
            if(xhr.status !== 200) {
                return;
            }
        
            const rsp = xhr.response;    
            const newTicket = `<li class="ticket" data-id=${rsp}>` +
                                `<input type="checkbox" class="check-button">` +
                                `<div class="text-ticket">${shortDescribe.value}</div>` +
                                `<div class="date-time">${timeStamp}</div>` +
                                `<div class="edit-button">&#9998</div>` +
                                `<div class="del-button">&#10008</div>`;
        
            MyHttp.#listTickets.insertAdjacentHTML('beforeEnd', newTicket);
            MyHttp.#listTickets.scrollTop = MyHttp.#listTickets.scrollHeight;
            document.body.querySelector('.modal').remove();
        }
    }

    static showDeleteTicket(evt) {

        if(!evt.target.classList.contains('del-button')) {
            return;
        }

        document.body.insertAdjacentHTML('beforeend', deleteForm);
        const delTicket = document.body.querySelector('.delete-ticket')
        
        delTicket.style.display = 'block';

        delTicket.querySelector('.delticket-cancel-button').onclick = (event) => {
            event.preventDefault();
            document.body.querySelector('.modal').remove();
            return;   
        }

        delTicket.querySelector('.delticket-delete-button').onclick = (event) => {

            event.preventDefault();
        
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if(xhr.readyState !== 4) {
                    return;
                }
            }
            xhr.open('DELETE', `http://localhost:7070?method=deleteTicket&id=${evt.target.parentElement.dataset.id}`);
            xhr.send();

            xhr.onload = () => {
                if(xhr.status !== 200) {
                    return;
                }
                evt.target.parentNode.remove();
                document.body.querySelector('.modal').remove();
            }
        }
    }

    static showDetailTicket(evt) {

        if(!evt.target.classList.contains('ticket') && !evt.target.classList.contains('text-ticket') &&
            !evt.target.classList.contains('date-time') && !evt.target.classList.contains('detail-ticket')) {
            return;
        }

        const parent = evt.target.classList.contains('ticket') ? evt.target : evt.target.parentElement;

        if(parent.dataset.detail) {
            parent.querySelector('.detail-ticket').remove();
            parent.style.height = '3rem';
            parent.querySelector('.text-ticket').style.height = '3rem';
            delete(parent.dataset.detail);
            return; 
        }

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if(xhr.readyState !== 4) {
                return;
            }
        }
        xhr.open('GET', `http://localhost:7070?method=ticketById&id=${parent.dataset.id}`);
        xhr.send();

        xhr.onload = () => {
            if(xhr.status !== 200) {
                return;
            }
            const rsp = xhr.response;

            parent.style.height = '9rem';
            parent.dataset.detail = true;
            parent.insertAdjacentHTML('beforeEnd', `<div class="detail-ticket">${rsp}</div>`);
        }
    }

    static loadTickets() {

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if(xhr.readyState !== 4) {
                return;
            }
        }
        xhr.open('GET', 'http://localhost:7070?method=allTickets');
        //xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.send();

        xhr.onload = () => {
            if(xhr.status !== 200) {
                return;
            }
            const rsp = xhr.response;
            
            rsp.forEach(element => {
                const checked = element.status ? 'checked' : '';
                const newTicket = `<li class="ticket" data-id=${element.id}>` +
                            `<input type="checkbox" class="check-button" ${checked}>` +
                            `<div class="text-ticket">${element.name}</div>` +
                            `<div class="date-time">${element.timestamp}</div>` +
                            `<div class="edit-button">&#9998</div>` +
                            `<div class="del-button">&#10008</div>`;            
                MyHttp.#listTickets.insertAdjacentHTML('beforeEnd', newTicket);
            });

            return;
        }
    }

    static setStatusTicket(evt) {

        if(!evt.target.classList.contains('check-button')) {
            return;
        }

        const status = evt.target.checked;
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if(xhr.readyState !== 4) {
                return;
            }
        }
        xhr.open('POST', 'http://localhost:7070?method=setStatus');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        const body = `id=${evt.target.parentElement.dataset.id}&status=${status}`;
        xhr.send(body);

        xhr.onload = () => {
            if(xhr.status !== 200) {
                evt.target.checked = status ? false : true;
                return;
            }
            
        }

        return;
    }

    static showEditTicket(evt) {

        if(!evt.target.classList.contains('edit-button')) {
            return;
        }

        document.body.insertAdjacentHTML('beforeEnd', editForm)
        const editTicket = document.querySelector('.edit-ticket');

        editTicket.querySelector('.ticket-short-describe').value = evt.target.parentElement.querySelector('.text-ticket').innerHTML;

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if(xhr.readyState !== 4) {
                return;
            }
        }
        xhr.open('GET', `http://localhost:7070?method=ticketById&id=${evt.target.parentElement.dataset.id}`);
        xhr.send();

        xhr.onload = () => {
            if(xhr.status !== 200 && xhr.status !== 204) {
                document.body.querySelector('.modal').remove();
                return;
            }
            const rsp = xhr.response;
            editTicket.querySelector('.ticket-long-describe').value = rsp;
        }

        editTicket.querySelector('.editticket-cancel-button').onclick = (evt) => {
            evt.preventDefault();
            editTicket.querySelector('.ticket-long-describe').value = null;
            document.body.querySelector('.modal').remove();
            return;   
        }

        editTicket.querySelector('.editticket-edit-button').onclick = (event) => {
            event.preventDefault();
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if(xhr.readyState !== 4) {
                    return;
                }
            }
            xhr.open('PATCH', 'http://localhost:7070?method=editTicket');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            const body = `id=${evt.target.parentElement.dataset.id}&` + 
                            `discribe=${encodeURIComponent(event.target.parentElement.querySelector('.ticket-long-describe').value)}`
            xhr.send(body);

            xhr.onload = () => {
                if(xhr.status !== 200) {
                    return;
                }
                document.body.querySelector('.modal').remove();
            }
        }
    }
}