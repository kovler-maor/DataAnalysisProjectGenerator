function parseString(input) {
    const lines = input.split('\n');
    let result = [];
    let currentLevel = [];

    for (let line of lines) {
        let match = line.match(/\$+title: '([\d. ]+) - (.+)',?/);
        if (match) {
            const [, level, title] = match;
            const depth = level.split('.').length;

            const newItem = {
                title: level,
                subItems: [],
                tooltip: ''
            };

            newItem.title = title;
            newItem.tooltip = '';

            if (depth === 1) {
                result.push(newItem);
                currentLevel = [newItem];
            } else {
                let parent = currentLevel[depth - 2];
                parent.subItems.push(newItem);
                currentLevel[depth - 1] = newItem;
            }
        }
    }

    return result;
}

const inputString = "$title: '1 - Data Analysis Project Roadmap',\n$$title: '1.1 - Data Understanding',\n$$$title: '1.1.1 - Gather Required Data',\n$$$title: '1.1.2 - Import Data',\n$$$title: '1.1.3 - Explore Data Structure',\n$$$title: '1.1.4 - Examine Data Types',\n$$$title: '1.1.5 - Handle Missing Values',\n$$title: '1.2 - Data Cleaning and Preparation',\n$$$title: '1.2.1 - Remove Duplicates',\n$$$title: '1.2.2 - Handle Outliers',\n$$$title: '1.2.3 - Normalize and Standardize',\n$$$title: '1.2.4 - Feature Engineering',\n$$$title: '1.2.5 - Split Data into Train and Test Sets',\n$title: '2 - Exploratory Data Analysis (EDA)',\n$$title: '2.1 - Univariate Analysis',\n$$$title: '2.1.1 - Analyze Individual Variables',\n$$$$title: '2.1.1.1 - Continuous Variables',\n$$$$title: '2.1.1.2 - Categorical Variables',\n$$$$title: '2.1.1.3 - Time Series Variables',\n$$title: '2.2 - Bivariate Analysis',\n$$$title: '2.2.1 - Correlation Analysis',\n$$$title: '2.2.2 - Visualizing Relationships',\n$$$title: '2.2.3 - Hypothesis Testing',\n$$title: '2.3 - Multivariate Analysis',\n$$$title: '2.3.1 - Dimensionality Reduction',\n$$$title: '2.3.2 - Cluster Analysis',\n$title: '3 - Modeling',\n$$title: '3.1 - Selecting Appropriate Models',\n$$$title: '3.1.1 - Supervised Learning',\n$$$title: '3.1.2 - Unsupervised Learning',\n$$title: '3.2 - Model Training and Evaluation',\n$$$title: '3.2.1 - Splitting Data for Training and Validation',\n$$$title: '3.2.2 - Model Training',\n$$$title: '3.2.3 - Model Evaluation',\n$$$$title: '3.2.3.1 - Metrics',\n$$$$title: '3.2.3.2 - Visualizations',\n$$title: '3.3 - Hyperparameter Tuning',\n$title: '4 - Deployment',\n$$title: '4.1 - Finalize Model',\n$$title: '4.2 - Prepare Deployment Environment',\n$$title: '4.3 - Deploy Model',\n$$title: '4.4 - Monitor and Maintain Model Performance'";

const parsedOutput = parseString(inputString);

console.log(parsedOutput[0]);