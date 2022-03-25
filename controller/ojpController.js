var oj = {};
var ojList = ["codeforces", "atcoder", "leetcode", "codechef", "uva", "lightoj"];

function getHtmlData(url) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                resolve(data);
            })
    })
}

function SelectOj(ojName) {
    for (let i = 0; i < ojList.length; i++) {
        document.getElementById(ojList[i]).classList.remove("is-active");
    }
    document.getElementById(ojName).classList.add("is-active");
}

function UpdateDOM() {
    document.getElementById("ojtitle").textContent = oj.title;
    document.getElementById("username").textContent = oj.username;
    document.getElementById("rating").textContent = oj.rating;
    document.getElementById("maxRating").textContent = oj.maxRating;
    document.getElementById("totalContest").textContent = oj.totalContest;
    document.getElementById("totalSolved").textContent = oj.totalSolved;
    document.getElementById("profile").textContent = oj.title;
    document.getElementById("profile").href = oj.profile;
    document.getElementById("email").textContent = oj.email;
}

//Codeforces
function OnClickCodeforces() {
    SelectOj("codeforces");

    oj.title = "Codeforces";

    fetch("https://codeforces.com/api/user.info?handles=niaz_bin_siraj")
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            oj.username = data.result[0].handle;
            oj.maxRating = data.result[0].maxRating;
            oj.rating = data.result[0].rating;

            return fetch("https://codeforces.com/api/user.rating?handle=niaz_bin_siraj")
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            oj.totalContest = data.result.length;

            return fetch("https://codeforces.com/api/user.status?handle=niaz_bin_siraj");
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            oj.totalSolved = 0;
            let len = data.result.length;
            let problems = new Map();
            for (let i = 0; i < len; i++) {
                let problemName = data.result[i].problem.name;
                if (data.result[i].verdict == "OK" && problems.has(problemName) == false) {
                    problems.set(problemName);
                    oj.totalSolved++;
                }
            }
            oj.profile = "https://codeforces.com/profile/niaz_bin_siraj";
            oj.email = "niaz3.1416@gmail.com";
        })
        .then(() => {
            UpdateDOM();
        })
}

//Atcoder
async function OnClickAtcoder() {
    SelectOj("atcoder");

    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://atcoder.jp/users/niaz_bin_siraj')}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
			let parser = new DOMParser();
            let doc = parser.parseFromString(data.contents, 'text/html');
            oj.title = "Atcoder";
            oj.rating = doc.getElementsByClassName("dl-table mt-2")[0].children[0].children[1].children[1].children[0].innerText;
            oj.maxRating = doc.getElementsByClassName("dl-table mt-2")[0].children[0].children[2].children[1].children[0].innerText;
            oj.totalContest = doc.getElementsByClassName("dl-table mt-2")[0].children[0].children[3].children[1].innerText;
            oj.profile = "https://atcoder.jp/users/niaz_bin_siraj";
            oj.email = "niaz9767@gmail.com";
            oj.username = doc.getElementsByClassName("username")[0].children[0].innerText;

            return fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://atcoder.jp/users/niaz_bin_siraj/history')}`);
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data.contents, 'text/html');
            let historyElement = doc.getElementById("history");

            let requests = [];
            for (let i = 0; i < historyElement.children[1].children.length; i++) {
                let contestURL = historyElement.children[1].children[i].children[1].children[1].href;
                let firstInd = contestURL.indexOf("/");
                let startInd = contestURL.indexOf("/", firstInd + 3);
                contestURL = "https://atcoder.jp" + contestURL.substr(startInd, contestURL.length - startInd);
                requests.push(getHtmlData(contestURL));
            }

            let solvedCount = 0;
            Promise.all(requests).then((htmldata) => {
                for (let hdata = 0; hdata < htmldata.length; hdata++) {
					let mark = new Map();
                    let doc = parser.parseFromString(htmldata[hdata].contents, 'text/html');
                    let rowsElements = doc.getElementsByClassName("table-responsive")[0].children[0].children[1].children;
                    let rows = rowsElements.length;
                    for (let i = 0; i < rows; i++) {
                        if (mark.has(rowsElements[i].children[1].innerText) == false) {
                            if (rowsElements[i].children[6].children[0].innerText == "AC") solvedCount++;
                            mark.set(rowsElements[i].children[1].innerText);
                        }
                    }
                }
            })
                .then(() => {
                    oj.totalSolved = solvedCount;
                    UpdateDOM();
                });
        })
}

//Leetcode
function OnClickLeetcode() {
    SelectOj("leetcode");
    
    fetch("/cpprofile/data/leetcode.json")
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        oj.username = data.username;
        oj.email = data.email;
        oj.profile = data.profile;
        oj.title = "Leetcode";
        oj.rating = data.currentRating;
        oj.maxRating = data.maxRating;
        oj.totalSolved = data.totalSolved;
        oj.totalContest = data.totalContest;
        UpdateDOM();
    })
}
