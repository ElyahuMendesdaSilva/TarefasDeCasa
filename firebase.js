import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { GoogleAuthProvider, signInWithPopup, getAuth, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { get, getDatabase, ref, set, onValue, remove,update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCX3r37GAHv8pGKSQfGp_dLUsLl21wMHqA",
    authDomain: "amaral9c.firebaseapp.com",
    projectId: "amaral9c",
    databaseURL: "https://amaral9c-default-rtdb.firebaseio.com/",
    storageBucket: "amaral9c.appspot.com",  // Remova essa linha duplicada
    messagingSenderId: "746877020688",
    appId: "1:746877020688:web:0a67d9bab9d0dc2c3e7895"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider(app);
const auth = getAuth(app);
const database = getDatabase(app);
const Lista_De_Tarefas = [
    "Limpar a caixa do gato",
    "Varrer Casa",
    "Passar pano",
    "Enxer Garrafas",
    "Estender as roupas",
    "Separar as roupas",
    "Arrumar Quartos",
    "Enxugar louça",
    "Lavar louça",
    "Limpar cozinha",
    "Botar Roupa pra lavar",
    "Arrumar quarto"
]

let ListaTarefas = []

let lista_De_Usuarios_A_ser_adicionados = []
let ButtonLogin = document.querySelector(".ButtonLogin");

let addAtv = (bool) => {
    return `
<div class=" ${bool ? "Create_ATV" : " Create_ATV Create_ATV_User"}">
        <form>
            <section class="TitleScetion">
                <h4>Tarefas do Dia</h4>
            </section>
            <section class="ListSection">
                <div id="checklist">
                </div>  
            </section>
            ${bool ? `
                <section class="ADDUSer" style="margin-top: 10px;">
                <div class="user_list">
                    
                </div>
                <button class="Btn" type="button">

                    <div class="sign">+</div>
                </button>
            </section>` : ``
        }
            <section class="SectionButton">
                ${bool ? `<button class="ButtonConfirm" type="button">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"></path></svg> 
                        Confirmar
                    </span>
                </button>` : ``
        }
                <button class="ButtonDelete" type="button">
                    <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                  </svg> 
                        Cancelar
                    </span>
                </button>
            </section>
        </form>
    </div>`}

if (ButtonLogin) {
    ButtonLogin.addEventListener("click", ev => {
        document.querySelector(".loaderBackground").style.display = "flex";
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                var user = result.user;
                localStorage.setItem('information', user.uid);
                await CreateUser(user);
                document.querySelector(".loaderBackground").style.display = "none";
                window.location.href = "Home/Home.html";
            }).catch((error) => {
                console.log("erro");
            });
    });
}
async function CreateUser(user) {
    try {
        const { displayName, photoURL, email, uid, ADM } = user;
        let Lista_tarefas = [];
        let Lista_tarefas_ADM = [];


        const usuariosRef = ref(database, 'usuarios/' + uid);
        const snapshot = await get(usuariosRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            // Verificar se o documento existe
            const userData = {
                id: uid,
                Nome: displayName,
                Imagem: photoURL,
                Email: email,
                Lista_tarefas: data.Lista_tarefas,
                Lista_tarefas_ADM: Lista_tarefas_ADM.length > 0 ? Lista_tarefas_ADM : [""],
                ADM: data.ADM
            };
            update(usuariosRef, userData);
            console.log("Documento existente, dados ", snapshot);
        } else {
            const userData = {
                id: uid,
                Nome: displayName,
                Imagem: photoURL,
                Email: email,
                Lista_tarefas:  [""] ,
                Lista_tarefas_ADM: Lista_tarefas_ADM.length > 0 ? Lista_tarefas_ADM : [""],
                ADM: "false"
            };
            await set(usuariosRef, userData);
            console.log("Novo documento criado");
        }

        console.log("Sucesso ao cadastrar");
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
    }
}




function Home() {
    document.querySelector("main").innerHTML = ""
    let element_main = (bool) => {
        return `
        <div class="container">
            <section class="bar_top">
                <div class="search" ${bool == true ? `style="width:"90%""` : ""}>
                    <input type="text" class="search__input" ${bool == true ? `style="width:"100%""` : ""}  placeholder="Pesquise alguma tarefa">
                    <button class="search__button">
                        <svg class="search__icon" aria-hidden="true" viewBox="0 0 24 24">
                            <g>
                                <path
                                    d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
                                </path>
                            </g>
                        </svg>
                    </button>
                </div>

                <!-- HTML !-->
                ${bool == true ? `<button class="button-26" id="Ok" type="button">Adicionar Tarefa</button>` : ""}
            </section>
            <div class="line"></div>
            <section class="Table">
                <div class="Name">
                    <p>Horario</p>
                </div>
                <div class="Tarefa">
                    <p>Tarefa</p>
                </div>
                <div class="Ações">
                    <p>Ações</p>
                </div>
            </section>
            <section class="list-card">

            </section>
        </div>`
    }
    let Lista_De_Usuarios = `
    <div class="Fundo_list_user">
    <div class="BGK_list_user">
        <section class="title_list_user_selection">
            <h3>Selecione</h3>
            <button class="button_list_user_close">
                <span class="X"></span>
                <span class="Y"></span>
            </button>
        </section>
        <div class="line"></div>
        <section class="list_user_selection">
            <img src="#" class="user_list_selection">
        </section>
    </div>
</div>
    `
    const information = localStorage.getItem("information")
    const starCountRef = ref(database, 'usuarios/' + information);
    onValue(starCountRef, (snapshot) => {
        document.querySelector("main").innerHTML = element_main(snapshot.val()["ADM"])
        document.querySelector(".usericon").src = snapshot.val().Imagem;
        document.querySelector("main").innerHTML += addAtv(snapshot.val().ADM)
        document.querySelector("main").innerHTML += Lista_De_Usuarios

        lista_De_Usuarios_A_ser_adicionados.push(information);

        Carregar(information, lista_De_Usuarios_A_ser_adicionados)


        document.querySelector("#Ok").addEventListener("click", ev => {
            document.querySelector(".Create_ATV").style.display = "flex";
            Abrir()
            let checkboxes = document.querySelectorAll('.classeCheck');

            checkboxes.forEach(function (checkbox) {
                checkbox.addEventListener('change', function () {
                    // Verifica se o checkbox está marcado
                    if (checkbox.checked) {
                        ListaTarefas.push(checkbox.id)
                    } else {
                        let elementoParaRemover = checkbox.id;

                        // Encontrar o índice do elemento que você deseja remover
                        let indiceDoElemento = ListaTarefas.indexOf(elementoParaRemover);

                        // Verificar se o elemento existe no array antes de tentar removê-lo
                        if (indiceDoElemento !== -1) {
                            // Remover o elemento usando splice
                            ListaTarefas.splice(indiceDoElemento, 1);

                            console.log("Elemento removido:", elementoParaRemover);
                            console.log("Novo array:", ListaTarefas);
                        } else {
                            console.log("Elemento não encontrado no array.");
                        }
                    }
                });
            });
        })

        document.querySelector(".ButtonConfirm").addEventListener("click", ev => {
            lista_De_Usuarios_A_ser_adicionados.push(information)
            Create_ATV_function(lista_De_Usuarios_A_ser_adicionados, information, lista_De_Usuarios_A_ser_adicionados, ListaTarefas)
            document.querySelector(".Create_ATV").style.display = "none";
            let teste = lista_De_Usuarios_A_ser_adicionados.push(information)
            Carregar(information, teste)
            lista_De_Usuarios_A_ser_adicionados = []
            ListaTarefas = []
        });

        document.querySelector(".ButtonDelete").addEventListener("click", ev => {
            document.querySelector(".Create_ATV").style.display = "none";

        })

        document.querySelector(".Btn").addEventListener("click", ev => {
            document.querySelector(".Fundo_list_user").style.display = "flex"
            SelecionarTudo(information).then((userList) => {

                preencherLista(userList, information);
                document.querySelectorAll(".user_list_selection").forEach(element => {
                    element.addEventListener("click", ev => {
                        lista_De_Usuarios_A_ser_adicionados.push(element.id);
                        element.remove()
                    });
                });



            }).catch((error) => {
                console.error('Error while fetching users:', error);
            });


        })

        document.querySelector(".button_list_user_close").addEventListener("click", ev => {
            document.querySelector(".Fundo_list_user").style.display = "none";
            // Suponha que sua div tenha a classe "suaDiv" e o botão que você deseja manter tenha a classe "seuBotao"
            let divContainer = document.querySelector(".ADDUSer");

            // Selecionar todos os elementos dentro da div, exceto o botão que você deseja manter
            let elementsToRemove = divContainer.querySelectorAll(":not(.Btn):not(.sign)");

            // Remover cada elemento encontrado
            elementsToRemove.forEach(element => {
                element.remove();
            });

            let indiceDoElemento = lista_De_Usuarios_A_ser_adicionados.indexOf(information);

            // Verificar se o elemento existe no array antes de tentar removê-lo
            if (indiceDoElemento !== -1) {
                // Remover o elemento usando splice
                lista_De_Usuarios_A_ser_adicionados.splice(indiceDoElemento, 1);

            }

            lista_De_Usuarios_A_ser_adicionados.forEach(element => {
                const usuariosRef = ref(database, 'usuarios/' + element);
                get(usuariosRef).then((snapshot) => {
                    if (snapshot.val()) {
                        let img = document.createElement("img");
                        img.classList.add("UsuarioSelecionadoIMG", "UsuarioSelecionado");
                        img.src = snapshot.val().Imagem;
                        img.id = snapshot.val().id

                        // Encontrar o índice do elemento que você deseja remove 

                        document.querySelector(".ADDUSer").appendChild(img);

                        // Add the event listener here
                        img.addEventListener("click", ev => {
                            img.remove();
                            // Suponha que você queira remover o elemento com valor 3
                            let elementoParaRemover = img.id;

                            // Encontrar o índice do elemento que você deseja remover
                            let indiceDoElemento = lista_De_Usuarios_A_ser_adicionados.indexOf(elementoParaRemover);

                            // Verificar se o elemento existe no array antes de tentar removê-lo
                            if (indiceDoElemento !== -1) {
                                // Remover o elemento usando splice
                                lista_De_Usuarios_A_ser_adicionados.splice(indiceDoElemento, 1);

                                console.log("Elemento removido:", elementoParaRemover);
                                console.log("Novo array:", lista_De_Usuarios_A_ser_adicionados);
                            } else {
                                console.log("Elemento não encontrado no array.");
                            }
                        });
                    }
                });
            });
        });

    });

}

document.querySelector(".usericon").addEventListener("click", ev => {
    auth.signOut().then(() => {
        localStorage.removeItem("information")
        document.cookie = "";
        window.location.href = "../index.html"
    }).catch((error) => {
        console.log(error)
    });
})

if (window.location.href.includes("Home/Home.html")) {
    window.onload = function () {
        Home();
    };
}

function Abrir_User(id, ATVID) {
    const checklistContainer = document.querySelector("#checklist");
    checklistContainer.innerHTML = ""; // Limpar o conteúdo existente

    const listCheck = document.createElement("ul");

    const usuariosRef = ref(database, 'usuarios/' + id + "/Lista_tarefas/" + (ATVID - 1));
    get(usuariosRef).then((snapshot) => {
        const data = snapshot.val();
        const list_ATV = data.Tarefas;

        list_ATV.forEach((element) => {
            const li = document.createElement("li");

            const label = document.createElement("label");
            label.className = "container1";
            label.innerText = Lista_De_Tarefas[element];

            li.appendChild(label);
            listCheck.appendChild(li);
        });

        // Adicionar a lista final ao contêiner
        checklistContainer.appendChild(listCheck);
    });
    document.querySelector(".ButtonDelete").addEventListener("click", ev => {
        document.querySelector(".Create_ATV").style.display = "none";

    })
    document.querySelector(".ButtonOpen").addEventListener("click", ev => {
        document.querySelector(".Create_ATV").style.display = "flex";

    })
}


function Abrir() {
    let listCheck = document.createElement("ul")
    Lista_De_Tarefas.forEach(function (element, index) {
        // Criação do elemento li
        const liElement = document.createElement('li');

        // Criação do elemento label com classe "container1"
        const labelContainer = document.createElement('label');
        labelContainer.className = 'container1';

        // Criação do elemento input com atributos type e checked
        const checkboxInput = document.createElement('input');
        checkboxInput.type = 'checkbox';
        checkboxInput.checked = false;
        checkboxInput.className = "classeCheck";
        checkboxInput.id = index

        // Criação do elemento div com classe "checkmark"
        const checkmarkDiv = document.createElement('div');
        checkmarkDiv.className = 'checkmark';

        // Criação do elemento span para o texto dentro do label
        const labelText = document.createElement('span');
        labelText.textContent = element;

        // Adição dos elementos criados à estrutura HTML
        labelContainer.appendChild(checkboxInput);
        labelContainer.appendChild(checkmarkDiv);
        labelContainer.appendChild(labelText);

        // Adicionando o label ao li
        liElement.appendChild(labelContainer);

        listCheck.appendChild(liElement);

        let list_Ch = document.querySelector("#checklist")
        list_Ch.appendChild(listCheck)
    });
}

async function SelecionarTudo(information) {
    const usuariosRef = ref(database, 'usuarios/');
    return get(usuariosRef).then((snapshot) => {
        if (snapshot.val()) {
            const usuariosData = snapshot.val();
            let lista = [];

            for (const userId in usuariosData) {
                const userData = usuariosData[userId];
                if (userId != information) {
                    lista.push(userData);
                }
            }
            return lista;
        } else {
            console.log('Nenhum usuário encontrado.');
            return [];
        }
    }).catch((error) => {
        console.error('Erro ao obter usuários:', error);
        return [];
    });
}


function preencherLista(informacoes, myid) {
    let lista_html = document.querySelector(".list_user_selection");
    lista_html.innerHTML = "";

    // Encontrar o índice do elemento que você deseja remover
    let indiceDoElemento = informacoes.indexOf(myid);

    // Verificar se o elemento existe no array antes de tentar removê-lo
    if (indiceDoElemento !== -1) {
        // Remover o elemento usando splice
        informacoes.splice(indiceDoElemento, 1);

    }


    informacoes.forEach(ifm => {
        if (ifm != myid) {
            let img = document.createElement("img");
            img.className = "user_list_selection";
            img.src = ifm.Imagem;
            lista_html.appendChild(img);
            img.id = ifm.id;
        }
    });
}


function Carregar(id, lista_De_Usuarios_A_ser_adicionados) {
    let Card = (Data, numeroTarefas, uid, State, ADM) => {
        return `
        <div class="Card">
            <div class="Data">
                <p>${Data}</p>
            </div>
            <div class="Tarefas">
                <p>Você tem ${numeroTarefas} tarefas para fazer</p>
            </div>
            <div class="Acoes">
                ${ADM == true ? `<span class="${State == true ? "situacaotrue" : "situacao"}" ></span>` :
                `<button class="ButtonOpen" id="${uid}">
                    <span>
                     Abrir
                    
                  </button>`
            }
                ${ADM == true ? `<button class="bin-button" type="button" id="${uid}">
                <svg class="bin-top" viewBox="0 0 39 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line>
                    <line x1="12" y1="1.5" x2="26.0357" y2="1.5" stroke="white" stroke-width="3"></line>
                </svg>
                <svg class="bin-bottom" viewBox="0 0 33 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="path-1-inside-1_8_19" fill="white">
                        <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                    </mask>
                    <path
                        d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                        fill="white" mask="url(#path-1-inside-1_8_19)"></path>
                    <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
                    <path d="M21 6V29" stroke="white" stroke-width="4"></path>
                </svg>
            </button>` : `<button  id="${uid}" ${State ? `class="disabled button2" disabled` : `class="button2"` }>Ok</button>
            `}
            </div>
        </div>`;
    }


    const usuariosRef = ref(database, 'usuarios/' + id);
    get(usuariosRef)
        .then((snapshot) => {
            const data = snapshot.val();
            document.querySelector(".list-card").innerHTML = "";

            if (data.ADM) {
                data.Lista_tarefas_ADM.forEach((element) => {
                    if (element !== "") {
                        document.querySelector(".list-card").innerHTML += Card(
                            element.Data,
                            element.Tarefas.length,
                            element.id,
                            element.State,
                            data.ADM
                        );
                    }
                });
            } else {
                data.Lista_tarefas.forEach((element) => {
                    if (element !== "") {
                        document.querySelector(".list-card").innerHTML += Card(
                            element.Data,
                            element.Tarefas.length,
                            element.id,
                            element.State,
                            data.ADM
                        );
                        console.log(element.ADM, "Oa")
                    }
                });
            }

            let CardItem = document.querySelectorAll('.bin-button');

            CardItem.forEach(function (item) {
                item.addEventListener('click', function () {

                    const CaminhoDoUsuario = `usuarios/${id}/Lista_tarefas_ADM/`;

                    get(ref(database, CaminhoDoUsuario))
                        .then((snapshot) => {
                            let list_PA = snapshot.val();


                            list_PA.forEach(elment => {
                                if (elment != "") {
                                    Delete(elment.Para, item.id)
                                }
                            })

                        })
                        .catch((error) => {
                            console.error("Erro ao obter dados:", error);
                        });
                });
            });

            document.querySelectorAll(".ButtonOpen").forEach(function (btn) {
                btn.addEventListener('click', function () {
                    document.querySelector(".Create_ATV").style.display = "flex"
                    document.querySelector("main").innerHTML += addAtv(data.ADM)
                    Abrir_User(data.id,btn.id).then(resp =>{
                        btn.disabled = true
                    })
                })
                document.querySelector(".ButtonDelete").addEventListener("click", ev => {
                    document.querySelector(".Create_ATV").style.display = "none";
    
                })
            })
            document.querySelector(".ButtonDelete").addEventListener("click", ev => {
                document.querySelector(".Create_ATV").style.display = "none";

            })
            document.querySelectorAll(".button2").forEach(function (btn) {
                btn.addEventListener('click', function () {
                    btn.disabled = true; // Adicione esta linha para desativar o botão quando pressionado
                    btn.classList.add("disabled");

                    const usuariosRef = ref(database, 'usuarios/' + data.id + "/Lista_tarefas/" + (btn.id - 1) )
                    get(usuariosRef).then((snapshot) => {
                        const data = snapshot.val();
                        console.log(data)
                        let userData = {
                            id: data.id,
                            Tarefas: data.Tarefas,
                            Para: data.Para,
                            Data: data.Data,
                            State: true,
                            Referecia: data.Referecia
                        };
            
                        update(usuariosRef, userData);
            
                        const Caminho = ref(database, 'usuarios/' + userData.Referecia + "/Lista_tarefas_ADM/" + (btn.id - 1) )
                        get(Caminho).then((snapshot) => {
                            const data = snapshot.val();
                            console.log(data)
                            let Data = {
                                id: data.id,
                                Tarefas: data.Tarefas,
                                Para: data.Para,
                                Data: data.Data,
                                State: true,
                                Referecia: data.Referecia
                            };
            
                            update(Caminho, Data);
                        })
                    })
                })
            })
            

        })
        .catch((error) => {
            console.error("Erro ao obter dados:", error);
        });
}


async function Create_ATV_function(user, meu, lista_De_Usuarios_A_ser_adicionados, ListaTarefas) {
    // Itere sobre os usuários fornecidos
    user.forEach(element => {
        // Construa a referência do usuário no banco de dados
        const usuariosRef = ref(database, 'usuarios/' + element);

        get(usuariosRef).then((snapshot) => {
            const data = snapshot.val();

            // Certifique-se de que os dados do snapshot são não nulos
            if (data) {
                if (data.ADM == true) {
                    // Inicialize Lista_tarefas_ADM como uma array se for undefined
                    let nova_Lista = data.Lista_tarefas_ADM;

                    // Encontrar o índice do elemento que você deseja remover
                    let indiceDoElemento = lista_De_Usuarios_A_ser_adicionados.indexOf(meu);

                    // Verificar se o elemento existe no array antes de tentar removê-lo
                    if (indiceDoElemento !== -1) {
                        // Remover o elemento usando splice
                        lista_De_Usuarios_A_ser_adicionados.splice(indiceDoElemento, 1);
                    } else {
                        console.log("Elemento não encontrado no array.");
                    }

                    const agora = new Date();
                    const horario = agora.toLocaleTimeString();
                    const primeirosCinco = horario.slice(0, 5);

                    const id_ATV = nova_Lista.length + 1;


                    let novaAtividade = {
                        id: id_ATV,
                        Tarefas: ListaTarefas,
                        Para: lista_De_Usuarios_A_ser_adicionados,
                        Data: primeirosCinco,
                        State: false,
                        Referecia: meu
                    };

                    nova_Lista.push(novaAtividade);

                    const NovoCaminho = ref(database, 'usuarios/' + element + "/Lista_tarefas_ADM");

                    // Atualize o array no banco de dados
                    set(NovoCaminho, nova_Lista)
                        .then(() => {
                            console.log("Sucesso na atualização de dados.");
                        })
                        .catch((error) => {
                            console.error("Erro na atualização de dados:", error);
                        });

                } else {
                    // Inicialize Lista_tarefas_ADM como uma array se for undefined
                    let nova_Lista = data.Lista_tarefas_ADM;

                    // Encontrar o índice do elemento que você deseja remover
                    let indiceDoElemento = lista_De_Usuarios_A_ser_adicionados.indexOf(meu);

                    // Verificar se o elemento existe no array antes de tentar removê-lo
                    if (indiceDoElemento !== -1) {
                        // Remover o elemento usando splice
                        lista_De_Usuarios_A_ser_adicionados.splice(indiceDoElemento, 1);
                    } else {
                        console.log("Elemento não encontrado no array.");
                    }

                    const agora = new Date();
                    const horario = agora.toLocaleTimeString();
                    const primeirosCinco = horario.slice(0, 5);

                    const id_ATV = nova_Lista.length + 1;


                    let novaAtividade = {
                        id: id_ATV,
                        Tarefas: ListaTarefas,
                        Para: lista_De_Usuarios_A_ser_adicionados,
                        Data: primeirosCinco,
                        State: false,
                        Referecia: meu
                    };

                    nova_Lista.push(novaAtividade);


                    const NovoCaminho = ref(database, 'usuarios/' + element + "/Lista_tarefas");

                    // Atualize o array no banco de dados
                    set(NovoCaminho, nova_Lista)
                        .then(() => {
                            console.log("Sucesso na atualização de dados.");
                        })
                        .catch((error) => {
                            console.error("Erro na atualização de dados:", error);
                        });

                }


            } else {
                console.error("Dados do snapshot estão indefinidos.");
            }
        });
    });
}


async function Delete(user, idToDelete) {
    user.forEach(element => {
        const usuariosRef = ref(database, 'usuarios/' + element);

        get(usuariosRef).then((snapshot) => {
            const data = snapshot.val();

            // Certifique-se de que os dados do snapshot são não nulos
            if (data) {
                // Inicialize Lista_tarefas_ADM como uma array se for undefined
                const listaTarefas = data.Lista_tarefas_ADM || [];



                // Verifique se a atividade foi encontrada
                // Encontre o índice da atividade no array
                const indiceDaAtividade = idToDelete - 1

                // Remova a atividade usando splice
                listaTarefas.splice(indiceDaAtividade, 1);

                const NovoCaminho = ref(database, 'usuarios/' + element + `${data.ADM ? "/Lista_tarefas_ADM" : "/Lista_tarefas"}`);

                // Atualize o array no banco de dados sem a atividade excluída
                set(NovoCaminho, listaTarefas)
                    .then(() => {
                        console.log("Sucesso")
                    })
                    .catch((error) => {
                        console.error("Erro na exclusão da atividade:", error);
                    });

            } else {
                console.error("Dados do snapshot estão indefinidos.");
            }
        });
    });
}

