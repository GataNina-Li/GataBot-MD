![brainly-scraper-languages](https://socialify.git.ci/hansputera/brainly-scraper-languages/image?description=1&font=Raleway&forks=1&issues=1&language=1&owner=1&pulls=1&stargazers=1&theme=Light)

This library retrieves data from Brainly that has been designed to avoid `403 Forbidden` exception.

> To avoid such errors, you can fill in a valid country code. You can test the 10 languages or country codes available to see if your server hosting country location or location is rejected.

See https://github.com/hansputera/brainly-scraper-languages/blob/master/AVAILABLE_LANGUAGES.md

# 💉 Installation
- Using NPM : `npm install brainly-scraper-v2`
- Using YARN : `yarn add brainly-scraper-v2`

# 📜 How to use
> WARNING:  Make sure the country code you entered in the constructor is correct.

- Code

```js
const { Brainly } = require("brainly-scraper-v2");
const brain = new Brainly("id"); // 'id' - Default to 'id'

// You can do
brain.searchWithMT("Pythagoras", "es").then(console.log).catch(console.error);
// Or (You need to enter correctly country code in the constructor).
brain.search("Pythagoras", "es").then(console.log).catch(console.error);
```

- Output

```json
[
  {
    question: {
      id: 5070014,
      content: 'Pythagoras nació en el año 580 a.c  y murió en el año 501. ¿Que edad tenia Pythagoras Cúando murió?',
      closed: true,
      created: [Object],
      attachments: [],
      author: [Object],
      education: 'matematicas',
      education_level: undefined,
      canBeAnswered: true,
      points_answer: [Object],
      points_question: 10,
      grade: 'Secundaria',
      lastActivity: '2020-09-22T00:22:19.000Z',
      verifiedAnswer: true
    },
    answers: [ [Object] ]
  }, { ... }
]
```

#  ⏱ Changelogs
You can check the changelogs on the [GitHub Releases Page](https://github.com/hansputera/brainly-scraper-languages/releases)

# ⚙️ Issues and Bugs
If you have problems using this library, you can create an issue in the [github repository](https://github.com/hansputera/brainly-scraper-languages). Remember, don't forget to read the instructions and try.

# ✍️ Contributions
Do you want to contribute with this library for the better? Very well, fork this [github repository](https://github.com/hansputera/brainly-scraper-languages) then install dependencies to your directory. Happy coding 😁
