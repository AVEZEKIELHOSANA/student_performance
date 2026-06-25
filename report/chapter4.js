const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  PageBreak, LevelFormat, BorderStyle, WidthType,
  Table, TableRow, TableCell, ShadingType
} = require('docx');
const fs = require('fs');

const FONT = "Times New Roman";
const BODY = 24;
const H1   = 32;
const H2   = 28;
const H3   = 24;
const LINE = { line: 360, lineRule: "auto" };
const CW   = 9072;

const pb  = () => new Paragraph({ children: [new PageBreak()] });
const bl  = () => new Paragraph({ spacing: LINE, children: [new TextRun({ text: "", font: FONT, size: BODY })] });

const body = (text) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { ...LINE, before: 0, after: 160 },
  children: [new TextRun({ text, font: FONT, size: BODY })]
});

const chHead = (text) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { ...LINE, before: 320, after: 320 },
  children: [new TextRun({ text, font: FONT, size: H1, bold: true })]
});

const secHead = (text) => new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { ...LINE, before: 280, after: 160 },
  children: [new TextRun({ text, font: FONT, size: H2, bold: true })]
});

const subHead = (text) => new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { ...LINE, before: 200, after: 120 },
  children: [new TextRun({ text, font: FONT, size: H3, bold: true })]
});

const mixed = (runs) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { ...LINE, before: 0, after: 160 },
  children: runs.map(r => new TextRun({ font: FONT, size: BODY, ...r }))
});

const figCaption = (text) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { ...LINE, before: 80, after: 200 },
  children: [new TextRun({ text, font: FONT, size: BODY, italics: true })]
});

const imgPlaceholder = (caption, figNum) => new Table({
  width: { size: CW, type: WidthType.DXA },
  columnWidths: [CW],
  rows: [
    new TableRow({
      children: [new TableCell({
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "003087" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "003087" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "003087" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "003087" }
        },
        shading: { fill: "EEF2FF", type: ShadingType.CLEAR },
        margins: { top: 400, bottom: 400, left: 200, right: 200 },
        width: { size: CW, type: WidthType.DXA },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({
            text: `[INSERT SCREENSHOT — ${caption}]`,
            font: FONT, size: BODY, bold: true, color: "003087"
          })]
        })]
      })]
    })
  ]
});

const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
const borders = { top: border, bottom: border, left: border, right: border };

const cell = (text, width, bold = false, shade = null) => new TableCell({
  borders,
  width: { size: width, type: WidthType.DXA },
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  shading: shade ? { fill: shade, type: ShadingType.CLEAR } : undefined,
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, font: FONT, size: BODY, bold })]
  })]
});

const lcell = (text, width, bold = false, shade = null) => new TableCell({
  borders,
  width: { size: width, type: WidthType.DXA },
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  shading: shade ? { fill: shade, type: ShadingType.CLEAR } : undefined,
  children: [new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, font: FONT, size: BODY, bold })]
  })]
});

const hcell = (text, width) => cell(text, width, true, "D9E1F2");

const numItem = (text, ref) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { ...LINE, before: 0, after: 100 },
  numbering: { reference: ref, level: 0 },
  children: [new TextRun({ text, font: FONT, size: BODY })]
});

const doc = new Document({
  numbering: {
    config: [
      { reference: "n1", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 }, spacing: LINE }, run: { font: FONT, size: BODY } } }] },
      { reference: "n2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 }, spacing: LINE }, run: { font: FONT, size: BODY } } }] },
    ]
  },
  styles: { default: { document: { run: { font: FONT, size: BODY } } } },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1134, bottom: 1134, left: 1417, right: 1417 }
      }
    },
    children: [

chHead("CHAPTER FOUR: IMPLEMENTATION AND RESULTS"),
bl(),

// ── 1. INTRODUCTION ─────────────────────────────────────────
secHead("1. Introduction"),
bl(),
body("This chapter presents the implementation of the student performance prediction system and documents the results obtained from each phase of its realisation. The chapter begins by describing the tools and materials used throughout the development process, followed by a detailed account of the implementation process covering the machine learning pipeline, the three-tier web application, and the database setup. The results obtained from exploratory data analysis, model training, model evaluation, and the web application are then presented and interpreted with reference to the supporting visual outputs generated during implementation. The chapter concludes with a comprehensive evaluation of the solution against the study objectives and a comparison with related works, followed by a partial conclusion."),
bl(),

// ── 2. TOOLS AND MATERIALS ──────────────────────────────────
secHead("2. Tools and Materials Used"),
bl(),
body("The implementation of the student performance prediction system required a diverse set of software tools, programming libraries, and hardware resources. Table 4.1 presents a complete summary of all tools and their respective roles in the project."),
bl(),

new Table({
  width: { size: CW, type: WidthType.DXA },
  columnWidths: [2300, 2000, 4772],
  rows: [
    new TableRow({ children: [hcell("Tool / Library", 2300), hcell("Version", 2000), hcell("Role in the Project", 4772)] }),
    new TableRow({ children: [lcell("Python", 2300), lcell("3.12", 2000), lcell("Primary programming language for ML pipeline and backend", 4772)] }),
    new TableRow({ children: [lcell("Jupyter Notebook", 2300), lcell("7.x", 2000), lcell("Interactive development environment for ML pipeline", 4772)] }),
    new TableRow({ children: [lcell("Anaconda", 2300), lcell("2025.x", 2000), lcell("Python distribution and environment manager", 4772)] }),
    new TableRow({ children: [lcell("pandas", 2300), lcell("2.3.3", 2000), lcell("Data manipulation, loading CSV files, and dataframe operations", 4772)] }),
    new TableRow({ children: [lcell("numpy", 2300), lcell("2.3.5", 2000), lcell("Numerical computation and array operations", 4772)] }),
    new TableRow({ children: [lcell("scikit-learn", 2300), lcell("1.6.1", 2000), lcell("Machine learning algorithms, preprocessing, and evaluation metrics", 4772)] }),
    new TableRow({ children: [lcell("imbalanced-learn", 2300), lcell("0.13.0", 2000), lcell("SMOTE oversampling for class imbalance correction", 4772)] }),
    new TableRow({ children: [lcell("matplotlib", 2300), lcell("3.10.3", 2000), lcell("EDA visualisations and result charts", 4772)] }),
    new TableRow({ children: [lcell("seaborn", 2300), lcell("0.13.2", 2000), lcell("Statistical visualisations including heatmaps and distribution plots", 4772)] }),
    new TableRow({ children: [lcell("joblib", 2300), lcell("1.5.1", 2000), lcell("Model serialisation — saving and loading .pkl artefacts", 4772)] }),
    new TableRow({ children: [lcell("FastAPI", 2300), lcell("0.138.0", 2000), lcell("RESTful API backend serving ML predictions via HTTP endpoints", 4772)] }),
    new TableRow({ children: [lcell("Uvicorn", 2300), lcell("0.49.0", 2000), lcell("ASGI server for running the FastAPI application", 4772)] }),
    new TableRow({ children: [lcell("Streamlit", 2300), lcell("1.51.0", 2000), lcell("Frontend web application framework for the user dashboard", 4772)] }),
    new TableRow({ children: [lcell("SQLAlchemy", 2300), lcell("2.0.51", 2000), lcell("Object-Relational Mapper for PostgreSQL database interaction", 4772)] }),
    new TableRow({ children: [lcell("PostgreSQL", 2300), lcell("15.x", 2000), lcell("Relational database for storing users, predictions, and cohorts", 4772)] }),
    new TableRow({ children: [lcell("psycopg2", 2300), lcell("2.9.12", 2000), lcell("PostgreSQL database driver for Python", 4772)] }),
    new TableRow({ children: [lcell("python-jose", 2300), lcell("3.5.0", 2000), lcell("JWT token creation and validation for authentication", 4772)] }),
    new TableRow({ children: [lcell("passlib / bcrypt", 2300), lcell("1.7.4 / 5.0.0", 2000), lcell("Secure password hashing using the bcrypt algorithm", 4772)] }),
    new TableRow({ children: [lcell("ReportLab", 2300), lcell("4.4.10", 2000), lcell("PDF report generation for individual and batch prediction exports", 4772)] }),
    new TableRow({ children: [lcell("requests", 2300), lcell("2.32.5", 2000), lcell("HTTP client used by Streamlit to call FastAPI endpoints", 4772)] }),
    new TableRow({ children: [lcell("GitHub", 2300), lcell("—", 2000), lcell("Version control and source code repository", 4772)] }),
    new TableRow({ children: [lcell("Kaggle", 2300), lcell("—", 2000), lcell("Source of the Student Lifestyle and GPA Prediction Dataset", 4772)] }),
    new TableRow({ children: [lcell("Hardware: Personal Laptop", 2300), lcell("—", 2000), lcell("Local development machine running Windows OS", 4772)] }),
  ]
}),
bl(),
body("Table 4.1: Complete list of tools and materials used in the implementation"),
bl(),

// ── 3. IMPLEMENTATION PROCESS ───────────────────────────────
secHead("3. Description of the Implementation Process"),
bl(),
body("The implementation of the student performance prediction system was carried out in two principal phases: the Machine Learning Pipeline Phase and the Web Application Development Phase. Each phase is described in full detail below, with references to supporting screenshots where applicable."),
bl(),

subHead("3.1. Phase 1 — Machine Learning Pipeline Implementation"),
bl(),
body("The machine learning pipeline was implemented entirely within a single Jupyter Notebook file named analysis.ipynb, located in the notebooks directory of the project repository. The notebook was structured as a sequential set of cells, each representing a distinct stage of the data science workflow. This structure ensures full reproducibility — any researcher can re-execute the notebook from start to finish and obtain identical results, as all random operations were seeded with the value 42 throughout."),
bl(),

mixed([{ text: "Stage 1 — Environment Setup and Data Loading: ", bold: true }, { text: "The first implementation stage involved importing all required Python libraries and loading the classification dataset (student_performance_grade.csv) from the data directory using pandas. The dataset was confirmed to contain 8,000 records and 18 columns. Figure 4.1 shows the first five records of the loaded dataset as produced by the df.head() method, confirming the successful import and the structure of the data." }]),
bl(),
imgPlaceholder("Figure 4.1 — Dataset head output (first 5 records, df.head())", "FIGURE 4.1"),
figCaption("Figure 4.1: First five records of the loaded dataset"),
bl(),

mixed([{ text: "Stage 2 — Data Cleaning and Inspection: ", bold: true }, { text: "A systematic data quality check was performed using isnull().sum(), duplicated().sum(), and dtypes. Figure 4.2 presents the output of the missing value check, confirming zero null values across all 18 columns. Figure 4.3 shows the basic statistical summary produced by df.describe(), covering count, mean, standard deviation, minimum, and maximum values for all numeric features." }]),
bl(),
imgPlaceholder("Figure 4.2 — Missing values output (all zeros confirmed)", "FIGURE 4.2"),
figCaption("Figure 4.2: Missing value check output confirming zero null values"),
bl(),
imgPlaceholder("Figure 4.3 — Descriptive statistics output (df.describe())", "FIGURE 4.3"),
figCaption("Figure 4.3: Descriptive statistics of all numeric features"),
bl(),

mixed([{ text: "Stage 3 — Contextual Adaptation: ", bold: true }, { text: "Two dataset adaptations were applied to align the data with the Cameroonian higher education context. The Previous_GPA column was rescaled from its original range (1.5 to 6.7) to the University of Buea 0 to 4 GPA scale using proportional rescaling, producing a new range of 0.9 to 4.0 with a mean of 1.787. The Age column was regenerated using a weighted probability distribution spanning ages 17 to 29, producing a realistic Cameroonian university age distribution with a mean of 21.17 years. Figure 4.4 shows the verification output confirming the successful rescaling of both features." }]),
bl(),
imgPlaceholder("Figure 4.4 — GPA rescaling and Age regeneration output", "FIGURE 4.4"),
figCaption("Figure 4.4: Contextual adaptation output showing GPA rescaling and Age distribution"),
bl(),

mixed([{ text: "Stage 4 — Exploratory Data Analysis: ", bold: true }, { text: "Eight-stage EDA was conducted, producing sixteen visualisations that are presented and interpreted in detail in Section 4 of this chapter. The EDA covered dataset overview, descriptive statistics, data quality checks, univariate analysis, bivariate and multivariate analysis, outlier detection, feature assessment, and insight formation. All charts were saved as PNG files to the notebooks directory using plt.savefig() for inclusion in the dissertation." }]),
bl(),

mixed([{ text: "Stage 5 — Feature Engineering: ", bold: true }, { text: "Ten Cameroon-specific features were engineered and appended to the dataset, expanding it from 17 to 27 columns. The engineering was applied consistently to both df_grade and df_score using a reusable engineer_features() function. A random seed of 42 was set before all generation operations. Figure 4.5 shows the feature engineering completion output, confirming the successful addition of all ten features and the expansion of the dataset shape." }]),
bl(),
imgPlaceholder("Figure 4.5 — Feature engineering completion output (shape 8000 x 27)", "FIGURE 4.5"),
figCaption("Figure 4.5: Feature engineering output confirming dataset expansion from 17 to 27 columns"),
bl(),

mixed([{ text: "Stage 6 — Preprocessing Pipeline: ", bold: true }, { text: "The preprocessing pipeline was implemented in six sequential steps. First, the Age column was dropped based on its negligible correlation with Final Score (r = 0.017). Second, all categorical columns were encoded using binary mapping, ordinal mapping, and one-hot encoding as appropriate, expanding the dataset to 29 features. Third, the target variable Grade was encoded using LabelEncoder with the mapping A=0, B=1, C=2, D=3, Fail=4. Fourth, an 80/20 stratified train-test split was performed, producing 6,400 training records and 1,600 test records. Fifth, StandardScaler was fitted on the training set only and applied to both sets. Sixth, SMOTE was applied exclusively to the scaled training set, balancing all five grade classes at 3,580 samples each and producing a final training set of 17,900 records. Figure 4.6 shows the preprocessing pipeline completion output." }]),
bl(),
imgPlaceholder("Figure 4.6 — Preprocessing pipeline completion output (SMOTE applied)", "FIGURE 4.6"),
figCaption("Figure 4.6: Preprocessing pipeline output showing balanced training set of 17,900 records"),
bl(),

mixed([{ text: "Stage 7 — Model Training: ", bold: true }, { text: "Four models were trained on the balanced training set (X_train_balanced, y_train_balanced) using scikit-learn's fit() method. The models were Logistic Regression, Decision Tree, Random Forest, and Tuned Random Forest. The Tuned Random Forest was trained using RandomizedSearchCV with 20 random parameter combinations, 3-fold cross-validation, and macro F1-score as the optimisation criterion. The search completed in 187.49 seconds and identified the optimal configuration as n_estimators=200, max_depth=None, min_samples_split=2, min_samples_leaf=1, max_features=log2 with a cross-validation macro F1-score of 92.38%." }]),
bl(),

mixed([{ text: "Stage 8 — Model Serialisation: ", bold: true }, { text: "The best-performing model (Logistic Regression) and three supporting artefacts were serialised to the models directory using joblib.dump(). The saved files were: best_model.pkl (2.83 KB), scaler.pkl (1.72 KB), label_encoder.pkl (0.40 KB), and feature_names.pkl (0.55 KB). A verification test confirmed that the reloaded model produced correct predictions. Figure 4.7 shows the serialisation completion output confirming all four files were saved successfully." }]),
bl(),
imgPlaceholder("Figure 4.7 — Model serialisation output (4 .pkl files saved to models/ folder)", "FIGURE 4.7"),
figCaption("Figure 4.7: Model serialisation output confirming all artefacts saved to the models directory"),
bl(),

subHead("3.2. Phase 2 — Web Application Implementation"),
bl(),
body("The web application was implemented as a three-tier system using FastAPI for the backend API layer, Streamlit for the frontend presentation layer, and PostgreSQL for the database persistence layer. The implementation required five distinct implementation steps."),
bl(),

mixed([{ text: "Step 1 — Database Configuration: ", bold: true }, { text: "The PostgreSQL database was configured by updating the connection string in app/database.py with the local credentials. The setup_db.py script was then executed, which established a connection to the PostgreSQL server, created the student_performance database, initialised all four tables (users, predictions, cohorts, cohort_students) using SQLAlchemy's Base.metadata.create_all() method, and created the default administrator account with a bcrypt-hashed password." }]),
bl(),
imgPlaceholder("Figure 4.8 — setup_db.py execution output (database and tables created)", "FIGURE 4.8"),
figCaption("Figure 4.8: Database setup output confirming table creation and admin account initialisation"),
bl(),

mixed([{ text: "Step 2 — FastAPI Backend Implementation: ", bold: true }, { text: "The FastAPI backend was implemented in app/main.py as a fully self-contained application comprising nine API endpoints, two Pydantic request and response schemas, a prediction engine, an advice engine, and role-based access control. The application was started using the Uvicorn ASGI server with the command: uvicorn app.main:app --reload --port 8000. On startup, the application asynchronously loaded all four ML artefacts and initialised the database connection. The FastAPI automatic documentation interface was accessible at http://localhost:8000/docs, providing an interactive interface for testing all endpoints." }]),
bl(),
imgPlaceholder("Figure 4.9 — FastAPI running in terminal (Uvicorn startup output)", "FIGURE 4.9"),
figCaption("Figure 4.9: FastAPI server startup output confirming ML artefacts loaded and server running"),
bl(),
imgPlaceholder("Figure 4.10 — FastAPI interactive documentation at localhost:8000/docs", "FIGURE 4.10"),
figCaption("Figure 4.10: FastAPI automatic API documentation showing all available endpoints"),
bl(),

mixed([{ text: "Step 3 — Streamlit Frontend Implementation: ", bold: true }, { text: "The Streamlit frontend was implemented in app/dashboard.py as a single-file multi-page application. The application was started in a second terminal window using the command: streamlit run app/dashboard.py. It automatically opened in the browser at http://localhost:8501. The frontend communicates with the FastAPI backend exclusively through HTTP requests using the requests library, maintaining clean tier separation." }]),
bl(),

mixed([{ text: "Step 4 — Authentication Implementation: ", bold: true }, { text: "The authentication system was implemented using JWT tokens issued by the FastAPI /api/v1/auth/login endpoint upon successful credential verification. The Streamlit frontend stores the token in session state and includes it in the Authorization header of all subsequent API calls. Password hashing was implemented using the bcrypt algorithm through the passlib library, ensuring that plain-text passwords are never stored at any point in the system." }]),
bl(),

mixed([{ text: "Step 5 — Deployment Configuration: ", bold: true }, { text: "The complete system requires two concurrent processes to be running simultaneously: the FastAPI backend on port 8000 and the Streamlit frontend on port 8501. These are started in two separate terminal windows. The system operates fully locally and does not require internet connectivity during operation, making it suitable for deployment in environments with limited or unreliable internet access — a key practical consideration in the Cameroonian context." }]),
bl(),

// ── 4. RESULTS ───────────────────────────────────────────────
secHead("4. Presentation and Interpretation of Results"),
bl(),
body("This section presents and interprets all results obtained from the implementation, organised into four subsections: EDA results, model training and evaluation results, feature importance results, and web application results."),
bl(),

subHead("4.1. Exploratory Data Analysis Results"),
bl(),
body("Exploratory data analysis was conducted across eight stages, producing sixteen visualisations. The key results are presented below."),
bl(),

mixed([{ text: "Target Variable — Final Score Distribution (Figure 4.11): ", bold: true }, { text: "The distribution of the Final_Score variable was found to be negatively skewed, with a mean of 83.21 and a median of 86.51. The histogram revealed that the majority of student records correspond to high scores in the range of 75 to 100, with very few students scoring below 50. The boxplot confirmed the presence of 115 outliers below the lower fence of 49.15, corresponding to students with unusually low performance. These outliers were retained as they represent the at-risk student population that is the primary target of this prediction system." }]),
bl(),
imgPlaceholder("Figure 4.11 — Final Score distribution (histogram + boxplot)", "FIGURE 4.11"),
figCaption("Figure 4.11: Distribution of Final Score showing negative skew, mean = 83.21, median = 86.51"),
bl(),

mixed([{ text: "Target Variable — Grade Distribution (Figure 4.12): ", bold: true }, { text: "The grade distribution chart revealed severe class imbalance in the dataset: Grade A accounted for 55.9% of all records (4,475 students), Grade B for 27.6% (2,212), Grade C for 13.2% (1,053), Grade D for 2.8% (226), and Grade Fail for only 0.4% (34 students). This imbalance was identified as a critical risk factor for model bias and was subsequently addressed using SMOTE during the preprocessing phase." }]),
bl(),
imgPlaceholder("Figure 4.12 — Grade distribution (bar chart + pie chart)", "FIGURE 4.12"),
figCaption("Figure 4.12: Grade distribution showing severe class imbalance with Grade A at 55.9% and Fail at 0.4%"),
bl(),

mixed([{ text: "Univariate Analysis — Numeric Features (Figure 4.13): ", bold: true }, { text: "The distributions of all nine numeric features were examined simultaneously. Hours_Studied, Sleep_Hours, Stress_Level, Screen_Time, and Exam_Anxiety_Score followed approximately normal distributions. Age exhibited a uniform distribution following contextual adaptation. Tutoring_Sessions_Per_Week displayed a discrete multimodal pattern consistent with its integer nature. Previous_GPA showed a normal distribution centred at approximately 1.79 on the UB 0 to 4 scale following rescaling." }]),
bl(),
imgPlaceholder("Figure 4.13 — Univariate analysis of all 9 numeric features", "FIGURE 4.13"),
figCaption("Figure 4.13: Univariate analysis of numeric features showing distribution shapes"),
bl(),

mixed([{ text: "Univariate Analysis — Categorical Features (Figure 4.14): ", bold: true }, { text: "The bar charts for all seven categorical features showed that gender was nearly balanced (Male: 3,906, Female: 3,810), offline study was the most common method (3,170 students), average diet quality dominated (3,980 students), and 820 students reported poor internet quality — a finding particularly significant in the Cameroonian context and one that motivated the engineering of the Internet_Accessibility feature." }]),
bl(),
imgPlaceholder("Figure 4.14 — Univariate analysis of 7 categorical features", "FIGURE 4.14"),
figCaption("Figure 4.14: Univariate analysis of categorical features showing distribution across categories"),
bl(),

mixed([{ text: "Correlation Heatmap (Figure 4.15): ", bold: true }, { text: "The correlation heatmap computed Pearson correlation coefficients between all numeric features and the Final Score target variable. The printed correlation output revealed that Hours_Studied exhibited the strongest positive correlation (r = 0.591), followed by Tutoring_Sessions_Per_Week (r = 0.472) and Previous_GPA (r = 0.291). Exam_Anxiety_Score showed the strongest negative correlation (r = -0.495), followed by Stress_Level (r = -0.297). Age showed a negligible correlation (r = 0.017) and was subsequently dropped from the feature set. The heatmap also confirmed that no pair of features exhibited a correlation strong enough to indicate problematic multicollinearity." }]),
bl(),
imgPlaceholder("Figure 4.15 — Correlation heatmap (numeric features vs Final Score)", "FIGURE 4.15"),
figCaption("Figure 4.15: Correlation heatmap showing Hours_Studied (r=0.591) as the strongest predictor"),
bl(),

mixed([{ text: "Bivariate Analysis — Key Features vs Final Score (Figure 4.16): ", bold: true }, { text: "Six scatter plots with trend lines examined the individual relationships between the strongest predictors and the Final Score target. The Hours_Studied scatter plot showed the clearest upward trend, with students studying 8 to 12 hours per day consistently scoring in the 85 to 100 range. The Exam_Anxiety_Score scatter plot showed the most visually striking downward trend, with students scoring 8 to 10 on anxiety consistently placing below 80. The Attendance scatter plot showed a positive but noisy relationship, consistent with its moderate correlation value." }]),
bl(),
imgPlaceholder("Figure 4.16 — Scatter plots: key features vs Final Score with trend lines", "FIGURE 4.16"),
figCaption("Figure 4.16: Bivariate scatter plots showing relationships between key features and Final Score"),
bl(),

mixed([{ text: "Bivariate Analysis — Key Features by Grade (Figure 4.17): ", bold: true }, { text: "Grouped box plots examined the distribution of four key features across all five grade categories. The Hours_Studied plot showed a clear and perfectly stepwise descending pattern — Grade A students had a median of approximately 6 hours per day, declining monotonically to approximately 1.5 hours for Fail students. The Stress_Level plot showed the inverse pattern — Grade A students had the lowest median stress (approximately 4.5) while Fail students had the highest (approximately 7.0). These patterns provided the strongest visual confirmation of the predictive relationships identified in the correlation analysis." }]),
bl(),
imgPlaceholder("Figure 4.17 — Box plots: key features by Grade (A/B/C/D/Fail)", "FIGURE 4.17"),
figCaption("Figure 4.17: Grouped box plots showing stepwise decline in Hours_Studied from Grade A to Fail"),
bl(),

mixed([{ text: "Bivariate Analysis — Categorical Features vs Final Score (Figure 4.18): ", bold: true }, { text: "Box plots of Final Score grouped by categorical feature values revealed that gender had no meaningful impact on academic performance — the median scores for Female, Male, and Non-Binary students were virtually identical at approximately 86 to 87. Hybrid study method showed a marginally higher median score than Offline and Online. Students with poor internet quality scored approximately 3 to 4 points lower than those with excellent quality, validating the importance of the Internet_Accessibility feature engineered for the Cameroonian context." }]),
bl(),
imgPlaceholder("Figure 4.18 — Box plots: categorical features vs Final Score", "FIGURE 4.18"),
figCaption("Figure 4.18: Categorical feature analysis showing gender neutrality and internet quality impact on scores"),
bl(),

subHead("4.2. Model Training and Evaluation Results"),
bl(),
body("Four models were trained and evaluated. The results for each are presented below with reference to their confusion matrices."),
bl(),

mixed([{ text: "Logistic Regression (Figure 4.19): ", bold: true }, { text: "The Logistic Regression model achieved an overall accuracy of 74.50% on the 1,600-record test set. The confusion matrix showed that 773 of 895 Grade A students were correctly classified (86% recall), 283 of 442 Grade B students (64%), 112 of 211 Grade C students (53%), 20 of 45 Grade D students (44%), and crucially, 4 of 7 Fail students were correctly identified — representing a Fail class recall of 57.14%. The weighted F1-score was 74.88% and the macro F1-score was 55.75%. Logistic Regression was the only model to successfully identify any failing students in the test set." }]),
bl(),
imgPlaceholder("Figure 4.19 — Logistic Regression confusion matrix", "FIGURE 4.19"),
figCaption("Figure 4.19: Logistic Regression confusion matrix (Accuracy: 74.50%, Fail Recall: 57.14%)"),
bl(),

mixed([{ text: "Decision Tree (Figure 4.20): ", bold: true }, { text: "The Decision Tree model achieved an accuracy of 63.00%, the lowest among all four models. The confusion matrix revealed significant misclassification across all grade categories, with only 660 of 895 Grade A students correctly classified (74%), 224 of 442 Grade B students (51%), 107 of 211 Grade C students (51%), 17 of 45 Grade D students (38%), and 0 of 7 Fail students identified. The macro F1-score of 40.02% and the complete failure to identify any failing students confirm that the Decision Tree was the weakest performer in this study. This underperformance is attributable to overfitting on the SMOTE-balanced training data, where the tree memorised synthetic patterns that did not generalise well to the real test distribution." }]),
bl(),
imgPlaceholder("Figure 4.20 — Decision Tree confusion matrix", "FIGURE 4.20"),
figCaption("Figure 4.20: Decision Tree confusion matrix (Accuracy: 63.00%, Fail Recall: 0.00%)"),
bl(),

mixed([{ text: "Random Forest — Original (Figure 4.21): ", bold: true }, { text: "The original Random Forest model with 100 estimators achieved an accuracy of 71.25%. The confusion matrix showed that 796 of 895 Grade A students were correctly classified (89% recall — the highest for Grade A across all models), but only 228 of 442 Grade B students (52%), 106 of 211 Grade C students (50%), 10 of 45 Grade D students (22%), and 0 of 7 Fail students were identified. Despite its higher Grade A recall, the Random Forest's inability to identify any failing students and its weaker performance on minority grade classes resulted in an overall accuracy below that of Logistic Regression." }]),
bl(),
imgPlaceholder("Figure 4.21 — Random Forest (original) confusion matrix", "FIGURE 4.21"),
figCaption("Figure 4.21: Random Forest confusion matrix (Accuracy: 71.25%, Fail Recall: 0.00%)"),
bl(),

mixed([{ text: "Tuned Random Forest (Figure 4.22): ", bold: true }, { text: "Following hyperparameter tuning using RandomizedSearchCV over 20 parameter combinations with 3-fold cross-validation, the optimal configuration (n_estimators=200, max_depth=None, min_samples_split=2, min_samples_leaf=1, max_features=log2) achieved a test accuracy of 72.31% — an improvement of +1.06% over the original Random Forest and a macro F1-score improvement of +2.33%. Despite this improvement, the Tuned Random Forest still failed to identify any Fail students and remained below Logistic Regression on all key metrics. This result demonstrates that hyperparameter optimisation provides measurable but limited gains when the algorithm is not intrinsically well suited to the data structure." }]),
bl(),
imgPlaceholder("Figure 4.22 — Tuned Random Forest confusion matrix", "FIGURE 4.22"),
figCaption("Figure 4.22: Tuned Random Forest confusion matrix (Accuracy: 72.31%, Fail Recall: 0.00%)"),
bl(),

body("Table 4.2 presents the complete comparative performance metrics for all four trained models."),
bl(),

new Table({
  width: { size: CW, type: WidthType.DXA },
  columnWidths: [2300, 1400, 1300, 1500, 1300, 1272],
  rows: [
    new TableRow({ children: [hcell("Model", 2300), hcell("Accuracy", 1400), hcell("F1 Macro", 1300), hcell("F1 Weighted", 1500), hcell("Precision", 1300), hcell("Fail Recall", 1272)] }),
    new TableRow({ children: [lcell("Logistic Regression", 2300), cell("74.50%", 1400), cell("55.75%", 1300), cell("74.88%", 1500), cell("75.41%", 1300), cell("57.14%", 1272, true)] }),
    new TableRow({ children: [lcell("Decision Tree", 2300), cell("63.00%", 1400), cell("40.02%", 1300), cell("64.56%", 1500), cell("67.05%", 1300), cell("0.00%", 1272)] }),
    new TableRow({ children: [lcell("Random Forest", 2300), cell("71.25%", 1400), cell("43.16%", 1300), cell("70.55%", 1500), cell("70.03%", 1300), cell("0.00%", 1272)] }),
    new TableRow({ children: [lcell("Tuned Random Forest", 2300), cell("72.31%", 1400), cell("45.49%", 1300), cell("71.55%", 1500), cell("71.01%", 1300), cell("0.00%", 1272)] }),
  ]
}),
bl(),
body("Table 4.2: Final model comparison summary — all evaluation metrics"),
bl(),
imgPlaceholder("Figure 4.23 — Final model comparison bar chart (Accuracy vs F1 Macro vs F1 Weighted)", "FIGURE 4.23"),
figCaption("Figure 4.23: Final model comparison chart showing Logistic Regression as best performer across all metrics"),
bl(),

subHead("4.3. Feature Importance Results"),
bl(),
body("Feature importance analysis was conducted using the Random Forest classifier's feature_importances_ attribute, which quantifies each feature's average contribution to reducing impurity across all 100 decision trees. Figure 4.24 presents the horizontal bar chart of the top 15 most important features."),
bl(),
imgPlaceholder("Figure 4.24 — Random Forest feature importance chart (top 15 features)", "FIGURE 4.24"),
figCaption("Figure 4.24: Random Forest feature importance chart — top 15 most predictive features"),
bl(),

body("The feature importance results are presented in Table 4.3 with their respective importance percentages and feature categories."),
bl(),

new Table({
  width: { size: CW, type: WidthType.DXA },
  columnWidths: [900, 3200, 1800, 3172],
  rows: [
    new TableRow({ children: [hcell("Rank", 900), hcell("Feature", 3200), hcell("Importance", 1800), hcell("Category", 3172)] }),
    new TableRow({ children: [cell("1", 900), lcell("Hours_Studied", 3200), cell("13.62%", 1800), lcell("Original — Academic behaviour", 3172)] }),
    new TableRow({ children: [cell("2", 900), lcell("Tutoring_Sessions_Per_Week", 3200), cell("10.21%", 1800), lcell("Original — Academic support", 3172)] }),
    new TableRow({ children: [cell("3", 900), lcell("Exam_Anxiety_Score", 3200), cell("9.56%", 1800), lcell("Original — Mental health", 3172)] }),
    new TableRow({ children: [cell("4", 900), lcell("Stress_Level", 3200), cell("6.18%", 1800), lcell("Original — Mental health", 3172)] }),
    new TableRow({ children: [cell("5", 900), lcell("Previous_GPA", 3200), cell("5.50%", 1800), lcell("Original — Academic history", 3172)] }),
    new TableRow({ children: [cell("6", 900), lcell("Motivation_Level", 3200), cell("4.59%", 1800), lcell("Engineered — Cameroon-specific", 3172)] }),
    new TableRow({ children: [cell("7", 900), lcell("Screen_Time", 3200), cell("4.12%", 1800), lcell("Original — Lifestyle", 3172)] }),
    new TableRow({ children: [cell("8", 900), lcell("Attendance", 3200), cell("4.03%", 1800), lcell("Original — Academic behaviour", 3172)] }),
    new TableRow({ children: [cell("9", 900), lcell("Psychological_State", 3200), cell("4.01%", 1800), lcell("Engineered — Cameroon-specific", 3172)] }),
    new TableRow({ children: [cell("10", 900), lcell("Sleep_Hours", 3200), cell("3.90%", 1800), lcell("Original — Lifestyle", 3172)] }),
    new TableRow({ children: [cell("11", 900), lcell("Diet_Quality", 3200), cell("3.17%", 1800), lcell("Original — Lifestyle", 3172)] }),
    new TableRow({ children: [cell("12", 900), lcell("Community_Beliefs", 3200), cell("3.16%", 1800), lcell("Engineered — Cameroon-specific", 3172)] }),
    new TableRow({ children: [cell("13", 900), lcell("Electricity_Availability", 3200), cell("2.97%", 1800), lcell("Engineered — Cameroon-specific", 3172)] }),
    new TableRow({ children: [cell("14", 900), lcell("Family_Support", 3200), cell("2.73%", 1800), lcell("Engineered — Cameroon-specific", 3172)] }),
    new TableRow({ children: [cell("15", 900), lcell("Home_Study_Environment", 3200), cell("2.71%", 1800), lcell("Engineered — Cameroon-specific", 3172)] }),
  ]
}),
bl(),
body("Table 4.3: Top 15 most important features with importance percentages and categories"),
bl(),
body("The feature importance results yield two significant findings. First, the three most important predictors — Hours_Studied (13.62%), Tutoring_Sessions_Per_Week (10.21%), and Exam_Anxiety_Score (9.56%) — are all original dataset features related to academic behaviour and mental health. This confirms the primary research hypothesis (H1) that study habits and psychological factors are the strongest predictors of academic performance. Second, six of the ten Cameroon-specific engineered features appear in the top fifteen most important predictors: Motivation_Level (4.59%), Psychological_State (4.01%), Community_Beliefs (3.16%), Electricity_Availability (2.97%), Family_Support (2.73%), and Home_Study_Environment (2.71%). This confirms the second research hypothesis (H2) that Cameroon-specific contextual factors contribute meaningfully to the prediction of student academic performance."),
bl(),

subHead("4.4. Web Application Results"),
bl(),
body("The three-tier web application was successfully implemented and tested across all three user roles. The results of each role's interface are presented below."),
bl(),

mixed([{ text: "Login and Registration Interface (Figure 4.25): ", bold: true }, { text: "The application presents a clean login page with two tabs: Sign In and Create Account. The Sign In tab accepts a username and password and sends a POST request to the FastAPI /api/v1/auth/login endpoint. Upon successful authentication, a JWT token is returned and stored in the session state. The Create Account tab allows new users to register with a chosen role (student, instructor, or admin). The interface provides clear error messages for invalid credentials or duplicate account details." }]),
bl(),
imgPlaceholder("Figure 4.25 — Web application login page", "FIGURE 4.25"),
figCaption("Figure 4.25: Web application login and registration page"),
bl(),

mixed([{ text: "Student Dashboard — Prediction Form (Figure 4.26): ", bold: true }, { text: "Upon login as a student, the system displays a three-tab dashboard. The first tab, Predict My Performance, presents the complete input form organised into four logical sections: Academic Information, Daily Habits and Lifestyle, Home and Community Environment, and Health and Wellbeing. Each input field is accompanied by a plain-language description explaining the variable in accessible terms. The form includes 29 input fields mapped directly to the 29 features used by the trained model." }]),
bl(),
imgPlaceholder("Figure 4.26 — Student dashboard prediction form (all four sections visible)", "FIGURE 4.26"),
figCaption("Figure 4.26: Student prediction form showing four input sections with plain-language descriptions"),
bl(),

mixed([{ text: "Student Dashboard — Prediction Result (Figure 4.27): ", bold: true }, { text: "After clicking the Predict My Performance button, the application displays three metric cards showing the predicted GPA range, academic status, and probability percentage. A horizontal bar chart visualises the probability distribution across all five possible GPA outcomes, enabling the student to understand not just the most likely outcome but the confidence of the prediction and the proximity of other outcomes. Below the chart, numbered personalised recommendations are displayed based on the student's specific input values, generated by the rule-based advice engine." }]),
bl(),
imgPlaceholder("Figure 4.27 — Prediction result showing GPA range, status, probability, chart and recommendations", "FIGURE 4.27"),
figCaption("Figure 4.27: Prediction result page showing GPA range, probability chart, and personalised advice"),
bl(),

mixed([{ text: "Student Dashboard — What-If Simulator (Figure 4.28): ", bold: true }, { text: "The second tab of the student dashboard implements the What-If simulator, which allows students to adjust input values and observe the resulting changes in their predicted outcome in real time. Unlike the prediction tab, simulator results are not saved to the database, enabling students to freely explore hypothetical scenarios without affecting their prediction history. The simulator uses the /api/v1/predict/whatif endpoint, which applies the full ML pipeline but omits the database insertion step." }]),
bl(),
imgPlaceholder("Figure 4.28 — What-If simulator showing adjusted inputs and updated prediction", "FIGURE 4.28"),
figCaption("Figure 4.28: What-If simulator allowing students to explore how changing habits affects predicted outcome"),
bl(),

mixed([{ text: "Student Dashboard — Prediction History (Figure 4.29): ", bold: true }, { text: "The third tab displays the student's last 20 predictions retrieved from the PostgreSQL database through the /api/v1/history endpoint. Each record shows the predicted GPA range, academic status, probability, key input values (study hours and attendance), and the date of the prediction. For students with more than one prediction on record, a line chart displays the trend of top probability over time, enabling students to track whether their predicted performance is improving." }]),
bl(),
imgPlaceholder("Figure 4.29 — Student prediction history and probability trend chart", "FIGURE 4.29"),
figCaption("Figure 4.29: Student prediction history showing past predictions and performance trend over time"),
bl(),

mixed([{ text: "Instructor Dashboard — Batch Prediction (Figure 4.30): ", bold: true }, { text: "The instructor dashboard provides a batch prediction interface that accepts a CSV file upload containing student records. After upload, the instructor can review the file contents and trigger batch prediction for all students simultaneously. The system processes each student record through the full ML pipeline and displays the results as a comprehensive table showing each student's predicted GPA range, academic status, and probability. The results are simultaneously saved to the cohorts and cohort_students tables in the PostgreSQL database." }]),
bl(),
imgPlaceholder("Figure 4.30 — Instructor batch prediction interface with CSV upload", "FIGURE 4.30"),
figCaption("Figure 4.30: Instructor batch prediction interface showing CSV upload and results table"),
bl(),

mixed([{ text: "Instructor Dashboard — Class Distribution Charts (Figure 4.31): ", bold: true }, { text: "Following batch prediction, the system automatically generates two class distribution charts: a bar chart showing the count of students at each GPA level and a pie chart showing the percentage distribution. These charts enable instructors to rapidly assess the academic risk profile of their class cohort and identify whether a significant proportion of students are at risk of falling into the Below Average or Fail categories." }]),
bl(),
imgPlaceholder("Figure 4.31 — Class distribution bar chart and pie chart", "FIGURE 4.31"),
figCaption("Figure 4.31: Class grade distribution charts generated from batch prediction results"),
bl(),

mixed([{ text: "Admin Dashboard — User Management (Figure 4.32): ", bold: true }, { text: "The administrator dashboard provides full user management capability. The User Management tab displays a complete table of all registered users with their IDs, usernames, emails, roles, and active status. Below the table, administrators can update any user's role or deactivate their account, and can permanently delete accounts. All these operations are executed through the FastAPI admin endpoints (/admin/users PATCH and DELETE) which are restricted to admin-role users exclusively through the JWT role verification system." }]),
bl(),
imgPlaceholder("Figure 4.32 — Admin panel showing user management interface", "FIGURE 4.32"),
figCaption("Figure 4.32: Admin user management panel showing all registered users with CRUD controls"),
bl(),

mixed([{ text: "Admin Dashboard — System Statistics (Figure 4.33): ", bold: true }, { text: "The System Statistics tab displays five real-time metrics retrieved from the /api/v1/admin/stats endpoint: total users, total students, total instructors, total predictions made, and total cohorts created. A system health indicator confirms whether the FastAPI server is online and the ML model is loaded. These metrics enable the administrator to monitor system usage and verify operational status." }]),
bl(),
imgPlaceholder("Figure 4.33 — Admin system statistics panel", "FIGURE 4.33"),
figCaption("Figure 4.33: Admin system statistics panel showing user counts, prediction counts, and system health"),
bl(),

mixed([{ text: "PDF Report Export (Figure 4.34): ", bold: true }, { text: "Both the student and instructor dashboards provide PDF report export functionality. Student reports contain the prediction result summary, the full probability breakdown table, and all numbered personalised recommendations in formal English. Instructor batch reports contain a class summary table showing the count and percentage of students at each GPA level, followed by the complete individual student results table. Reports are generated using the ReportLab library and are formatted as professional A4 documents bearing the University of Buea header." }]),
bl(),
imgPlaceholder("Figure 4.34 — Sample exported PDF report", "FIGURE 4.34"),
figCaption("Figure 4.34: Sample exported PDF prediction report formatted for University of Buea"),
bl(),

// ── 5. EVALUATION ────────────────────────────────────────────
secHead("5. Evaluation of the Solution"),
bl(),
body("The evaluation of the solution is conducted along three dimensions: performance against literature benchmarks, fulfilment of the study objectives, and alignment with the system functional requirements."),
bl(),

subHead("5.1. Comparison with Existing Works"),
bl(),
body("The most directly comparable benchmark study is Hashim et al. (2020), who evaluated seven supervised machine learning algorithms for student performance prediction at the University of Basrah, Iraq, using a dataset of 499 students with eight features. Their best-performing algorithm, Logistic Regression, achieved an accuracy of 68.7% for predicting exact grade categories. The present study, using the same algorithm on a larger and contextually enriched dataset, achieved 74.50% — an improvement of 5.80 percentage points. Table 4.4 presents the comparative analysis."),
bl(),

new Table({
  width: { size: CW, type: WidthType.DXA },
  columnWidths: [3000, 1600, 1600, 1600, 1272],
  rows: [
    new TableRow({ children: [hcell("Study", 3000), hcell("Algorithm", 1600), hcell("Accuracy", 1600), hcell("Dataset Size", 1600), hcell("Features", 1272)] }),
    new TableRow({ children: [lcell("Hashim et al. (2020)", 3000), cell("Logistic Regression", 1600), cell("68.70%", 1600), cell("499 students", 1600), cell("8", 1272)] }),
    new TableRow({ children: [lcell("Cortez & Silva (2008)", 3000), cell("Random Forest", 1600), cell("~65%", 1600), cell("649 students", 1600), cell("30", 1272)] }),
    new TableRow({ children: [lcell("Delen (2010)", 3000), cell("Neural Network", 1600), cell("~73%", 1600), cell("35,000 students", 1600), cell("~12", 1272)] }),
    new TableRow({ children: [lcell("Present Study", 3000), cell("Logistic Regression", 1600), cell("74.50%", 1600), cell("8,000 students", 1600), cell("29", 1272, true)] }),
  ]
}),
bl(),
body("Table 4.4: Comparison of the present study with related works in the literature"),
bl(),
body("The present study outperforms the most directly comparable published work and achieves comparable accuracy to studies that used significantly larger datasets. Furthermore, the present study introduces dimensions that none of the compared works address: (1) Cameroon-specific contextual feature engineering; (2) a three-tier web application with role-based access control and prediction history; (3) bilingual support for English and French; and (4) batch class prediction for instructors with exportable PDF and CSV reports."),
bl(),

subHead("5.2. Fulfilment of Study Objectives"),
bl(),
body("All six specific objectives stated in Chapter One were fulfilled through the implementation. Table 4.5 maps each objective to the corresponding implementation outcome and the section of this chapter where the evidence is presented."),
bl(),

new Table({
  width: { size: CW, type: WidthType.DXA },
  columnWidths: [3600, 3600, 1872],
  rows: [
    new TableRow({ children: [hcell("Specific Objective", 3600), hcell("Implementation Outcome", 3600), hcell("Evidence", 1872)] }),
    new TableRow({ children: [lcell("Collect and preprocess a suitable university-level dataset", 3600), lcell("8,000-record synthetic dataset loaded, cleaned, and contextually adapted", 3600), lcell("Section 3.1, Figures 4.1–4.4", 1872)] }),
    new TableRow({ children: [lcell("Perform Cameroon-specific feature engineering", 3600), lcell("10 contextual features added, dataset expanded to 27 columns", 3600), lcell("Section 3.1, Figure 4.5", 1872)] }),
    new TableRow({ children: [lcell("Conduct EDA across all eight stages", 3600), lcell("16 visualisations generated across 8 EDA stages", 3600), lcell("Section 4.1, Figures 4.11–4.18", 1872)] }),
    new TableRow({ children: [lcell("Train and evaluate three ML algorithms", 3600), lcell("Four models trained (including tuned RF), all evaluated on 1,600-record test set", 3600), lcell("Section 4.2, Figures 4.19–4.23", 1872)] }),
    new TableRow({ children: [lcell("Compare models and select the best performer", 3600), lcell("Logistic Regression selected: 74.50% accuracy, 57.14% Fail recall", 3600), lcell("Section 4.2, Table 4.2", 1872)] }),
    new TableRow({ children: [lcell("Deploy best model as a web application", 3600), lcell("Three-tier Streamlit/FastAPI/PostgreSQL system deployed locally", 3600), lcell("Section 4.4, Figures 4.25–4.34", 1872)] }),
  ]
}),
bl(),
body("Table 4.5: Mapping of study objectives to implementation outcomes"),
bl(),

subHead("5.3. Fulfilment of Functional Requirements"),
bl(),
body("The system functional requirements defined in the Software Requirements Specification were evaluated against the implemented system. Table 4.6 presents the evaluation results."),
bl(),

new Table({
  width: { size: CW, type: WidthType.DXA },
  columnWidths: [900, 3500, 2500, 2172],
  rows: [
    new TableRow({ children: [hcell("FR", 900), hcell("Requirement", 3500), hcell("Implementation Status", 2500), hcell("Evidence", 2172)] }),
    new TableRow({ children: [cell("FR-1.1", 900), lcell("Authentication via username and password", 3500), lcell("Fully implemented — JWT-based login", 2500), lcell("Figure 4.25", 2172)] }),
    new TableRow({ children: [cell("FR-1.2", 900), lcell("Role-based access for Student, Instructor, Admin", 3500), lcell("Fully implemented — API-level role enforcement", 2500), lcell("Section 4.4", 2172)] }),
    new TableRow({ children: [cell("FR-1.3", 900), lcell("Account creation with authentication setup", 3500), lcell("Fully implemented — registration with bcrypt hashing", 2500), lcell("Figure 4.25", 2172)] }),
    new TableRow({ children: [cell("FR-2.1", 900), lcell("Student individualised dashboard", 3500), lcell("Fully implemented — three-tab student dashboard", 2500), lcell("Figure 4.26", 2172)] }),
    new TableRow({ children: [cell("FR-2.2", 900), lcell("Display passing probability using ML model", 3500), lcell("Fully implemented — GPA range + probability chart", 2500), lcell("Figure 4.27", 2172)] }),
    new TableRow({ children: [cell("FR-2.3", 900), lcell("Automatic improvement recommendations", 3500), lcell("Fully implemented — rule-based advice engine", 2500), lcell("Figure 4.27", 2172)] }),
    new TableRow({ children: [cell("FR-2.4", 900), lcell("What-If simulation with interactive sliders", 3500), lcell("Fully implemented — separate simulator tab", 2500), lcell("Figure 4.28", 2172)] }),
    new TableRow({ children: [cell("FR-2.5", 900), lcell("View prediction history", 3500), lcell("Fully implemented — history tab with trend chart", 2500), lcell("Figure 4.29", 2172)] }),
    new TableRow({ children: [cell("FR-3.1", 900), lcell("Instructor batch prediction with CSV/PDF reports", 3500), lcell("Fully implemented — CSV upload + dual export", 2500), lcell("Figures 4.30–4.31, 4.34", 2172)] }),
    new TableRow({ children: [cell("FR-3.2", 900), lcell("Performance goal setting for cohorts", 3500), lcell("Partially implemented — cohort saving; goal alerts deferred to further works", 2500), lcell("Chapter 5", 2172)] }),
    new TableRow({ children: [cell("FR-3.3", 900), lcell("Early intervention trigger for at-risk students", 3500), lcell("Deferred to further works — requires email/SMS integration", 2500), lcell("Chapter 5", 2172)] }),
    new TableRow({ children: [cell("FR-4.1", 900), lcell("Admin CRUD privileges over user accounts", 3500), lcell("Fully implemented — full create/read/update/delete", 2500), lcell("Figure 4.32", 2172)] }),
    new TableRow({ children: [cell("FR-4.2", 900), lcell("System monitoring and connectivity check", 3500), lcell("Fully implemented — health endpoint + statistics panel", 2500), lcell("Figure 4.33", 2172)] }),
  ]
}),
bl(),
body("Table 4.6: Functional requirements evaluation summary"),
bl(),
body("Of the fourteen functional requirements defined in the SRS, twelve were fully implemented in the V1 prototype. Two requirements — FR-3.2 (performance goal alerts) and FR-3.3 (early intervention notifications) — were partially or not implemented in V1 and are proposed as directions for future work in Chapter Five. The two deferred features require external service integration (email or SMS APIs) that falls outside the scope of the V1 prototype."),
bl(),

// ── 6. PARTIAL CONCLUSION ────────────────────────────────────
secHead("6. Partial Conclusion"),
bl(),
body("This chapter has presented the complete implementation and results of the student performance prediction system. The machine learning pipeline was implemented in nine sequential stages, producing a trained Logistic Regression model with an accuracy of 74.50% and a Fail class recall of 57.14% — the only model to successfully identify at-risk students among all four evaluated algorithms. Feature importance analysis confirmed that six of the ten Cameroon-specific engineered features ranked among the top fifteen most predictive variables, validating the contextual adaptation methodology of this research."),
bl(),
body("The three-tier web application was implemented using FastAPI, Streamlit, and PostgreSQL, successfully delivering twelve of the fourteen functional requirements defined in the Software Requirements Specification. The system provides distinct role-based interfaces for students, instructors, and administrators, with capabilities including personalised performance prediction, What-If simulation, prediction history tracking, batch class prediction with distribution analytics, user management, and PDF and CSV report export. The solution outperforms the most directly comparable published benchmark study (Hashim et al., 2020) by 5.80 percentage points in accuracy, while introducing capabilities — including role-based access control, contextual Cameroon-specific features, bilingual support, and exportable institutional reports — that none of the reviewed related works provide. The following chapter presents the conclusion and further works of this research."),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('C:\\Users\\PC\\Documents\\Student_performance\\student_performance\\report\\Chapter4_Implementation_and_Results.docx', buf);
  console.log('Chapter 4 generated successfully!');
});