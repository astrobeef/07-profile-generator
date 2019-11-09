const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const Octokit = require("@octokit/rest");

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const octokit = Octokit({
    userAgent : "Profile generator",
    baseUrl : "https://api.github.com",
})

const user = {
    img_src : "http://placehold.jp/200x200.png",
    username : "test name",
    links : {
        github : "https://github.com/astrobeef",
        location : "https://www.google.com/maps?q=phoenix+google+maps&rlz=1C1CHBF_enUS869US869&um=1&ie=UTF-8&sa=X&ved=0ahUKEwj7pJiS7dvlAhVkGDQIHWUrBYIQ_AUIEigB",
        blog : "https://astrobeef.github.io/Responsive-Portfolio-w-Bootstrap/index.html"
    },
    bio : "test bio",
    repository_count : 0,
    follower_count : 0,
    GHStars_count : 0,
    following_count : 0
}

var data;

let template = `
<h1> Hello my name is {{ name }}
`;

template = replacePlaceholder(template, "name", user.username);

writeFile("index.html", template);
console.log("Wrote template to file : index.html");

function replacePlaceholder(template, target, value){
    console.log("-Replacing placeholder, " + target + ", with the value of " + value);
    const regex = new RegExp("{{ " + target + " }}", "gm");
    const newTemplate = template.replace(regex, value);

    console.log("-...Returning new template")
    return newTemplate;
}

async function getData()
{
    data = await octokit.users.getByUsername(
        {
            username : "astrobeef"
        }
    )
    
    console.log(data);
}

getData();

console.log(data);