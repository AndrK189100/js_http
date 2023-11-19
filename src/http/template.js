
export const myHttp =   '<div class="http">' +
                            '<button type="button" class="add-ticket-button">Добавить</button>' +
                            '<ol class="tickets-list"></ol>' +
                        '</div>';

export const addForm = '<div class="modal">' +
                            '<form class="add-ticket">' +
                                '<div>Добавить тикет</div>' +
                                '<input type="text" placeholder="Краткое описание" class="ticket-short-describe" maxlength="55">' +
                                '<textarea type="text" placeholder="Подробное описание" class="ticket-long-describe" maxlength="256"> </textarea>' +
                                '<button class="ticket-add-button">Добавить</bitton>' +
                                '<button class="ticket-cancel-button">Отмена</button>' +
                            '</form>' +
                        '</div>';    

export const deleteForm = '<div class="modal">' +
                                '<form class="delete-ticket">' +
                                    '<div><h4>Удалить тикет</h4></div>' +
                                    '<div>Вы уверены, что хотите удалить тикет?</div>' +
                                    '<button class="delticket-delete-button">Удалить</bitton>' +
                                    '<button class="delticket-cancel-button">Отмена</button>' +
                                '</form>' +
                            '</div>';


export const editForm = '<div class="modal">' +
                            '<form class="edit-ticket">' +
                                '<div>Изменить тикет</div>' +
                                '<input type="text" class="ticket-short-describe" disabled>' +
                                '<textarea type="text" class="ticket-long-describe" maxlength="256"> </textarea>' +
                                '<button class="editticket-edit-button">Изменить</bitton>' +
                                '<button class="editticket-cancel-button">Отмена</button>' +
                            '</form>' +
                        '</div>';    