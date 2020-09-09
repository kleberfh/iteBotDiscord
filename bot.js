const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const axios = require('axios');

const copsMessage = "Em caso de investigação policial, eu declaro que não tenho envolvimento com este grupo e não sei" +
    " como estou no mesmo, provavelmente fui inserido por terceiros, declaro que estou disposto a colaborar com as" +
    " investigações e estou disposto a me apresentar a depoimento se necessário";

const handleMessageSend = (message, content, file = false) => {
    if (file) {
        message.channel.send(content, {
            files: [file]
        }).then(messageResponse => {
            handleMessageDestroy(messageResponse)
        })
    } else {
        message.channel.send(content).then(messageResponse => {
            handleMessageDestroy(messageResponse)
        })
    }
    handleMessageDestroy(message);
}

const handleImageFetch = async (message, ra) => {
    await axios.get(`${config.photoUrl}pessoa=${ra}`, {
        responseType: 'stream'
    }).then(response => {
        if (response.headers['content-type'] !== 'text/html') {
            handleMessageSend(message,'Olha a cara do belezão!', response.data)
        } else {
            handleMessageSend(message, `Eita, não consegui achar a foto desse R.A :(`)
        }
    }).catch(error => {
        handleMessageSend(message, `Eita, não consegui achar a foto desse R.A :(`)
    });
}

const handleMessageDestroy = (message) => {
    message.delete({ timeout: 12000 })
}

const handleMessageBulkDestroy = async (message, messages) => {
    await message.channel.bulkDelete(messages)
}

client.on('ready', () => {
    client.user.setActivity('Assistindo aula da Audrey e melhorando meu vocabulario :)\n\n$comandos')
})

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLocaleLowerCase();

    if (message.content[0] === '$') {
        switch (comando) {
            case 'foto':
                if (args.length > 0) {
                    await handleImageFetch(message, args[0])
                } else {
                    handleMessageSend(message, 'Você precisa enviar o R.A para que eu possa identificar o aluno')
                }
                return;
            case 'criador':
                handleMessageSend(message, "Meu criador é o Klebão, o mlk é brabo!")
                return;
            case 'comandos':
                handleMessageSend(message, '\nEsses são meus comandos: ' +
                    '\n\n$foto [R.A] - Mostra a foto do aluno pelo R.A ' +
                    '\n$criador - Exibe quem me criou. ' +
                    '\n$comandos - Para exibir os comandos. ' +
                    '\n$destruir_provas - Limpa os comandos enviados ao bot e o as respostas do bot. ' +
                    '\nNome - Para o ober o nome faça login em https://www.ite.edu.br/iniciacao/Login após ' +
                    'isso entre em https://www.ite.edu.br/iniciacao/Iniciacao/BuscarAluno/?ra= com o R.A no final')
                return;
            case 'destruir_provas':
                const allMessages = [];
                await message.channel.messages.fetch()
                    .then(async messages => {
                        await messages.map(async message => {
                            if (message.channel.id === config.defaultChannel) {
                                if (message.content[0] === '$') {
                                    await allMessages.push(message)
                                } else if (message.author.id === '751575905658470421') {
                                    await allMessages.push(message)
                                }
                            }
                        })
                    })
                await handleMessageBulkDestroy(message, allMessages)
                handleMessageSend(message, copsMessage)
                return;
            default:
                handleMessageSend(message, 'Ops! Não conheço esse comando, para ver meus comandos digite $comandos')
                return;
        }
    } else {
        return;
    }
})

client.login(config.token)
