const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const Octokit = require("@octokit/rest");

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const octokit = Octokit({
    userAgent: "Profile generator",
    baseUrl: "https://api.github.com",
})

const user = {
    img_src: "http://placehold.jp/200x200.png",
    username: "test name",
    name: "name",
    github: " ",
    location: " ",
    blog: " ",
    bio: "test bio",
    repository_count: 0,
    follower_count: 0,
    GHStars_count: 0,
    following_count: 0
}

var data;

var template = "--";

function replacePlaceholder(template, target, value) {
    console.log("-Replacing placeholder, " + target + ", with the value of " + value);
    const regex = new RegExp("{{ " + target + " }}", "gm");
    const newTemplate = template.replace(regex, value);

    console.log("-...Returning new template")
    return newTemplate;
}

readFile("./index_template.html", "utf8").then(pTemplate => {

    template = pTemplate;

    getData();
})

async function getData() {
    console.log("-Fetching user data...");

    data = await octokit.users.getByUsername(
        {
            username: "astrobeef"
        }
    )

    data = data.data;

    user.name = data.name;
    user.username = data.login;
    user.bio = data.bio;
    user.follower_count = data.followers;
    user.following_count = data.following;
    user.img_src = data.avatar_url;
    user.GHStars_count = data.starred_url;
    user.blog = data.blog;
    user.github = data.url;
    user.location = data.location;
    user.repository_count = data.public_repos;

    console.log(`-Retrieved user data : ${JSON.stringify(user)}`);
    console.log("-Finished getting data");
    console.log("----------------------");

    generateHTML();
}

function generateHTML() {
    for (key in user) {
        template = replacePlaceholder(template, key, user[key]);
    }

    writeFile("index.html", template);
    console.log("Wrote template to file : index.html");
    console.log("-----------------------------------")

}