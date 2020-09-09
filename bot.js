const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const axios = require('axios');
const fs = require('fs');

const copsMessage = "Em caso de investigação policial, eu declaro que não tenho envolvimento com este grupo e não sei" +
    " como estou no mesmo, provavelmente fui inserido por terceiros, declaro que estou disposto a colaborar com as" +
    " investigações e estou disposto a me apresentar a depoimento se necessário";

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
                    message.channel.send('Procurando imagem...')
                    axios.get(`${config.photoUrl}pessoa=${args[0]}`, {
                        responseType: 'stream'
                    })
                        .then(response => {
                            if (response.headers['content-type'] !== 'text/html') {
                                message.channel.send('Olha a cara do belezão!', {
                                    files: [response.data]
                                })
                            } else {
                                message.channel.send(`Eita, não consegui achar a foto desse R.A :(`)
                            }
                        })
                        .catch(error => {
                            message.channel.send(`Eita, não consegui achar a foto desse R.A :(`)
                        });
                } else {
                    message.channel.send('Você precisa enviar o R.A para que eu possa identificar o aluno')
                }
                return;
            case 'criador':
                message.channel.send("Meu criador é o Klebão, o mlk é brabo!")
                return;
            case 'comandos':
                message.channel.send('\nEsses são meus comandos: ' +
                    '\n\n$foto [R.A] - Mostra a foto do aluno pelo R.A ' +
                    '\n$criador - Exibe quem me criou. ' +
                    '\n$comandos - Para exibir os comandos. ' +
                    '\n$destruir_provas - Limpa os comandos enviados ao bot e o as respostas do bot. ' +
                    '\nNome - Para o ober o nome faça login em https://www.ite.edu.br/iniciacao/Login após isso entre em https://www.ite.edu.br/iniciacao/Iniciacao/BuscarAluno/?ra= com o R.A no final')
                return;
            case 'info':
                console.log(client)
                return;
            case 'destruir_provas':
                const allMessages = [];
                await message.channel.messages.fetch()
                    .then(messages => {
                        messages.map(message => {
                            if (message.channel.id === config.defaultChannel) {
                                if (message.content[0] === '$') {
                                    allMessages.push(message)
                                } else if (message.author.id === '751575905658470421') {
                                    allMessages.push(message)
                                }
                            }
                        })
                    })
                message.channel.bulkDelete(allMessages)
                    .then(() => message.channel.send(copsMessage))
                return;
            default:
                message.channel.send('Ops! Não conheço esse comando, para ver meus comandos digite $comandos')
                return;
        }
    } else {
        return;
    }

})

client.login(config.token)
