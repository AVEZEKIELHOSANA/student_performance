
const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  PageBreak, LevelFormat, BorderStyle, WidthType,
  Table, TableRow, TableCell, ShadingType, VerticalAlign
} = require('docx');
const fs = require('fs');

// ── UB FET FORMATTING CONSTANTS ──────────────────────────────
const FONT = "Times New Roman";
const BODY  = 24;   // 12pt
const H1    = 32;   // 16pt
const H2    = 28;   // 14pt
const H3    = 24;   // 12pt bold
const LINE  = { line: 360, lineRule: "auto" }; // 1.5 spacing

// A4, margins: left/right 2.5cm = 1417 DXA, top/bottom 2cm = 1134 DXA

// ── HELPERS ───────────────────────────────────────────────────
const pb   = () => new Paragraph({ children: [new PageBreak()] });
const bl   = () => new Paragraph({ spacing: LINE, children: [new TextRun({ text: "", font: FONT, size: BODY })] });

const body = (text, opts = {}) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { ...LINE, before: 0, after: 160 },
  children: [new TextRun({ text, font: FONT, size: BODY })],
  ...opts
});

const centered = (text, size = BODY, bold = false) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { ...LINE, before: 120, after: 120 },
  children: [new TextRun({ text, font: FONT, size, bold })]
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

const refEntry = (text) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { ...LINE, before: 0, after: 160 },
  indent: { left: 720, hanging: 720 },
  children: [new TextRun({ text, font: FONT, size: BODY })]
});

const numItem = (text, ref) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { ...LINE, before: 0, after: 100 },
  numbering: { reference: ref, level: 0 },
  children: [new TextRun({ text, font: FONT, size: BODY })]
});

// ── TABLE HELPER ─────────────────────────────────────────────
const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
const borders = { top: border, bottom: border, left: border, right: border };

const cell = (text, width, bold = false, shading = null) => new TableCell({
  borders,
  width: { size: width, type: WidthType.DXA },
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  shading: shading ? { fill: shading, type: ShadingType.CLEAR } : undefined,
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, font: FONT, size: BODY, bold })]
  })]
});

const hcell = (text, width) => cell(text, width, true, "D9E1F2");

// content width = 11906 - 1417*2 = 9072 DXA
const CW = 9072;

const doc = new Document({
  numbering: {
    config: [
      { reference: "num1", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 }, spacing: LINE }, run: { font: FONT, size: BODY } } }] },
      { reference: "num2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 }, spacing: LINE }, run: { font: FONT, size: BODY } } }] },
      { reference: "num3", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 }, spacing: LINE }, run: { font: FONT, size: BODY } } }] },
    ]
  },
  styles: {
    default: { document: { run: { font: FONT, size: BODY } } }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1134, bottom: 1134, left: 1417, right: 1417 }
      }
    },
    children: [

// ════════════════════════════════════════════════════════════
// TITLE PAGE
// ════════════════════════════════════════════════════════════
centered("UNIVERSITY OF BUEA", BODY, true),
centered("FACULTY OF ENGINEERING AND TECHNOLOGY", BODY, true),
centered("DEPARTMENT OF COMPUTER ENGINEERING", BODY, true),
bl(), bl(),
centered("PREDICTING STUDENT PERFORMANCE IN HIGHER INSTITUTIONS USING MACHINE LEARNING TECHNIQUES", H1, true),
bl(), bl(),
centered("A dissertation submitted to the Department of Computer Engineering, Faculty of Engineering and Technology, University of Buea, in Partial Fulfilment of the Requirements for the Award of Bachelor of Engineering (B.Eng.) Degree in Computer Engineering.", BODY),
bl(), bl(),
centered("By:", BODY, true),
bl(),
centered("AV", BODY, true),
centered("Matriculation Number: FE22A160", BODY, true),
centered("Option: Software Engineering", BODY, true),
bl(), bl(),
centered("Supervisor:", BODY, true),
centered("Dr. Sop", BODY),
centered("University of Buea", BODY),
bl(), bl(),
centered("2025/2026 Academic Year", BODY, true),
pb(),

// ════════════════════════════════════════════════════════════
// CERTIFICATION OF ORIGINALITY
// ════════════════════════════════════════════════════════════
centered("CERTIFICATION OF ORIGINALITY", H2, true),
bl(),
body('We the undersigned, hereby certify that this dissertation entitled "Predicting Student Performance in Higher Institutions Using Machine Learning Techniques" presented by AV, Matriculation Number FE22A160, has been carried out by him/her in the Department of Computer Engineering, Faculty of Engineering and Technology, University of Buea, under the supervision of Dr. Sop.'),
bl(),
body("This dissertation is authentic and represents the fruits of his/her own research and efforts."),
bl(), bl(),
body("Date: ___________________________"),
bl(), bl(),
new Paragraph({
  spacing: LINE,
  children: [
    new TextRun({ text: "Student", font: FONT, size: BODY }),
    new TextRun({ text: "                                          Supervisor", font: FONT, size: BODY }),
  ]
}),
new Paragraph({
  spacing: LINE,
  children: [
    new TextRun({ text: "___________________________", font: FONT, size: BODY }),
    new TextRun({ text: "          ___________________________", font: FONT, size: BODY }),
  ]
}),
bl(), bl(),
body("Head of Department"),
body("___________________________"),
pb(),

// ════════════════════════════════════════════════════════════
// DEDICATION
// ════════════════════════════════════════════════════════════
centered("DEDICATION", H2, true),
bl(),
body("This dissertation is dedicated to all Cameroonian students striving for academic excellence despite the challenges of limited resources, unreliable infrastructure, and socioeconomic pressures. May this work serve as both a tool and an inspiration for a better educational future."),
pb(),

// ════════════════════════════════════════════════════════════
// ACKNOWLEDGEMENT
// ════════════════════════════════════════════════════════════
centered("ACKNOWLEDGEMENT", H2, true),
bl(),
body("First and foremost, I express my sincere gratitude to my supervisor, Dr. Sop, whose guidance, patience, and academic mentorship were instrumental in the successful completion of this project. His insightful feedback, constructive criticism, and encouragement throughout the research process were invaluable."),
bl(),
body("I extend my appreciation to the University of Buea, Faculty of Engineering and Technology, and the Department of Computer Engineering for providing the academic environment, resources, and framework that made this research possible. The knowledge and skills acquired throughout my undergraduate studies at this institution have been the foundation upon which this project was built."),
bl(),
body("I am equally grateful to all the lecturers of the Department of Computer Engineering who imparted knowledge, challenged my thinking, and prepared me for both academic and professional life. Their dedication to teaching has shaped my understanding of software engineering and computer science."),
bl(),
body("My heartfelt thanks go to my family for their unwavering support, financial sacrifice, and encouragement throughout my academic journey. Their belief in my abilities has been a constant source of motivation."),
bl(),
body("I also thank my friends and coursemates for their moral support, collaborative spirit, and the many discussions that enriched my understanding of this subject. Their input and encouragement throughout the course of this project were deeply appreciated."),
pb(),

// ════════════════════════════════════════════════════════════
// ABSTRACT
// ════════════════════════════════════════════════════════════
centered("ABSTRACT", H2, true),
bl(),
body("The rapid expansion of higher education enrolment in Cameroon has intensified the need for data-driven approaches to understanding and improving student academic outcomes. Higher institutions in Cameroon face persistent challenges including inadequate infrastructure, limited access to educational resources, unstable electricity supply, and significant socioeconomic disparities among students — all of which profoundly influence academic performance. Despite the growing global adoption of machine learning techniques in educational data mining, a critical gap exists in research that contextualises these methods within the Cameroonian higher education environment. This study addresses that gap by developing a machine learning-based predictive system specifically adapted for Cameroonian higher institutions."),
bl(),
body("A synthetic university-level dataset of 8,000 student records was used as the primary data source, comprising academic, behavioural, lifestyle, and socioeconomic attributes. The dataset was enriched through deliberate feature engineering to incorporate ten Cameroon-specific contextual factors including electricity availability, home internet accessibility, peer influence, community beliefs regarding education, family support, home study environment, motivation level, lecture quality, physical health, and psychological state. Following thorough exploratory data analysis, the dataset was preprocessed using label encoding, one-hot encoding, StandardScaler normalisation, and SMOTE oversampling to address class imbalance. Four machine learning models were trained and evaluated: Logistic Regression, Decision Tree, Random Forest, and Tuned Random Forest. Logistic Regression achieved the highest overall performance with an accuracy of 74.50% and a weighted F1-score of 74.88%, and was the only model to successfully identify failing students with a Fail class recall of 57.14%. Feature importance analysis confirmed that six of the ten Cameroon-specific engineered features ranked among the top fifteen most predictive variables, validating the research hypothesis that contextual factors unique to Cameroon contribute meaningfully to academic performance prediction. The best-performing model was deployed as an interactive web application using Streamlit, providing students, academic counsellors, and institutional administrators with a practical tool for real-time performance prediction and early identification of at-risk students."),
bl(),
mixed([
  { text: "Keywords: ", bold: true },
  { text: "Machine Learning, Student Performance Prediction, Educational Data Mining, Feature Engineering, Higher Education, Cameroon, Logistic Regression, Random Forest, Decision Tree, SMOTE, Streamlit Web Application." }
]),
pb(),

// ════════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ════════════════════════════════════════════════════════════
centered("TABLE OF CONTENTS", H2, true),
bl(),
body("Certification of Originality ............................................................. ii"),
body("Dedication ................................................................................... iii"),
body("Acknowledgement .......................................................................... iv"),
body("Abstract ...................................................................................... v"),
body("Table of Contents .......................................................................... vi"),
body("List of Tables ............................................................................... vii"),
body("List of Figures .............................................................................. viii"),
body("List of Abbreviations ...................................................................... ix"),
bl(),
body("CHAPTER ONE: GENERAL INTRODUCTION ...................................... 1"),
body("    1. Background and Context of the Study ......................................... 1"),
body("    2. Problem Statement ................................................................... 3"),
body("    3. Objectives of the Study ............................................................. 4"),
body("        3.1. General Objective ............................................................. 4"),
body("        3.2. Specific Objectives ........................................................... 4"),
body("    4. Proposed Methodology .............................................................. 5"),
body("    5. Research Questions .................................................................. 6"),
body("    6. Research Hypothesis ................................................................ 6"),
body("    7. Significance of the Study .......................................................... 7"),
body("    8. Scope of the Study .................................................................. 8"),
body("    9. Delimitation of the Study .......................................................... 8"),
body("    10. Definition of Keywords and Terms .............................................. 9"),
body("    11. Organisation of the Dissertation ................................................ 11"),
bl(),
body("CHAPTER TWO: LITERATURE REVIEW ............................................. 12"),
body("    1. Introduction .......................................................................... 12"),
body("    2. General Concepts .................................................................... 12"),
body("        2.1. Machine Learning ............................................................ 12"),
body("        2.2. Educational Data Mining ................................................... 13"),
body("        2.3. Student Performance Prediction ........................................... 14"),
body("        2.4. Key Machine Learning Algorithms ......................................... 15"),
body("    3. Related Works ........................................................................ 17"),
body("    4. Partial Conclusion ................................................................... 21"),
bl(),
body("CHAPTER THREE: ANALYSIS AND DESIGN ...................................... 22"),
body("    1. Introduction .......................................................................... 22"),
body("    2. Methodology .......................................................................... 22"),
body("    3. Design .................................................................................. 23"),
body("        3.1. Dataset Description .......................................................... 23"),
body("        3.2. Data Preprocessing ........................................................... 24"),
body("    4. Global Architecture of the Solution ............................................. 26"),
body("    5. Description of the Algorithms .................................................... 27"),
body("    6. Description of the Resolution Process .......................................... 28"),
body("        6.1. Exploratory Data Analysis .................................................. 28"),
body("        6.2. Feature Engineering ......................................................... 30"),
body("        6.3. Encoding and Scaling ....................................................... 33"),
body("        6.4. SMOTE Balancing ............................................................ 34"),
body("    7. Partial Conclusion ................................................................... 35"),
bl(),
body("CHAPTER FOUR: IMPLEMENTATION AND RESULTS .......................... 36"),
body("    1. Introduction .......................................................................... 36"),
body("    2. Tools and Materials Used .......................................................... 36"),
body("    3. Description of the Implementation Process ................................... 37"),
body("    4. Presentation and Interpretation of Results ................................... 38"),
body("    5. Evaluation of the Solution ........................................................ 43"),
body("    6. Partial Conclusion ................................................................... 45"),
bl(),
body("CHAPTER FIVE: CONCLUSION AND FURTHER WORKS ..................... 46"),
body("    1. Summary of Findings ............................................................... 46"),
body("    2. Contribution to Engineering and Technology ................................. 47"),
body("    3. Recommendations .................................................................... 48"),
body("    4. Difficulties Encountered ........................................................... 48"),
body("    5. Further Works ........................................................................ 49"),
bl(),
body("References ..................................................................................... 50"),
body("Appendices .................................................................................... 53"),
pb(),

// ════════════════════════════════════════════════════════════
// LIST OF TABLES
// ════════════════════════════════════════════════════════════
centered("LIST OF TABLES", H2, true),
bl(),
body("Table 3.1: Original dataset features and Cameroonian contextual mapping .... 23"),
body("Table 3.2: Categorical encoding mapping .............................................. 33"),
body("Table 3.3: Engineered Cameroon-specific features ................................... 31"),
body("Table 4.1: Tools and libraries used ..................................................... 36"),
body("Table 4.2: Outlier detection results using IQR method ............................. 38"),
body("Table 4.3: Logistic Regression classification report ................................ 39"),
body("Table 4.4: Decision Tree classification report ........................................ 40"),
body("Table 4.5: Random Forest classification report ....................................... 41"),
body("Table 4.6: Tuned Random Forest classification report .............................. 41"),
body("Table 4.7: Final model comparison summary ........................................... 42"),
body("Table 4.8: Comparison with Hashim et al. (2020) .................................... 44"),
pb(),

// ════════════════════════════════════════════════════════════
// LIST OF FIGURES
// ════════════════════════════════════════════════════════════
centered("LIST OF FIGURES", H2, true),
bl(),
body("Figure 3.1: Global architecture of the proposed system ........................... 26"),
body("Figure 3.2: CRISP-DM methodology framework ........................................ 22"),
body("Figure 4.1: Distribution of Final Score ................................................ 38"),
body("Figure 4.2: Grade distribution — count and percentage ............................ 38"),
body("Figure 4.3: Univariate analysis — numeric features ................................. 38"),
body("Figure 4.4: Univariate analysis — categorical features ............................. 38"),
body("Figure 4.5: Correlation heatmap — numeric features vs Final Score ............. 39"),
body("Figure 4.6: Bivariate analysis — key features vs Final Score ..................... 39"),
body("Figure 4.7: Bivariate analysis — key features by Grade ........................... 39"),
body("Figure 4.8: Bivariate analysis — categorical features vs Final Score ........... 39"),
body("Figure 4.9: Logistic Regression confusion matrix .................................... 40"),
body("Figure 4.10: Decision Tree confusion matrix ........................................... 40"),
body("Figure 4.11: Random Forest confusion matrix .......................................... 41"),
body("Figure 4.12: Tuned Random Forest confusion matrix .................................. 42"),
body("Figure 4.13: Random Forest top 15 feature importance chart ...................... 42"),
body("Figure 4.14: Final model comparison chart ............................................. 43"),
body("Figure 4.15: Streamlit web application — home page ................................ 44"),
body("Figure 4.16: Streamlit web application — prediction result page ................. 44"),
pb(),

// ════════════════════════════════════════════════════════════
// LIST OF ABBREVIATIONS
// ════════════════════════════════════════════════════════════
centered("LIST OF ABBREVIATIONS", H2, true),
bl(),
body("AI        Artificial Intelligence"),
body("AUC       Area Under the Curve"),
body("CSV       Comma-Separated Values"),
body("CRISP-DM  Cross-Industry Standard Process for Data Mining"),
body("EDM       Educational Data Mining"),
body("EDA       Exploratory Data Analysis"),
body("F1        F1-Score (harmonic mean of Precision and Recall)"),
body("FET       Faculty of Engineering and Technology"),
body("FP        False Positive"),
body("FN        False Negative"),
body("GCE       General Certificate of Education"),
body("GPA       Grade Point Average"),
body("IQR       Interquartile Range"),
body("KNN       K-Nearest Neighbours"),
body("ML        Machine Learning"),
body("MLP       Multi-Layer Perceptron"),
body("NB        Naive Bayes"),
body("pkl       Pickle file format"),
body("ROC       Receiver Operating Characteristic"),
body("SMOTE     Synthetic Minority Oversampling Technique"),
body("SVM       Support Vector Machine"),
body("TP        True Positive"),
body("TN        True Negative"),
body("UB        University of Buea"),
body("XGBoost   Extreme Gradient Boosting"),
pb(),

// ════════════════════════════════════════════════════════════
// CHAPTER ONE
// ════════════════════════════════════════════════════════════
chHead("CHAPTER ONE: GENERAL INTRODUCTION"),
bl(),
secHead("1. Background and Context of the Study"),
bl(),
body("Education is universally recognised as a fundamental driver of socioeconomic development and national progress. In Cameroon, higher education has undergone significant expansion over the past two decades, with university enrolment rising substantially across public and private institutions. The University of Buea, established in 1993 as Cameroon's first anglophone university, has grown into one of the country's leading higher institutions, offering programmes across engineering, technology, sciences, and the humanities. Despite this growth, persistent challenges continue to undermine academic outcomes, including high failure rates, student dropout, and widespread academic underperformance across faculties and departments (World Bank, 2021)."),
bl(),
body("The factors contributing to poor academic performance in Cameroonian higher institutions are multidimensional and deeply contextualised. Students face academic pressures compounded by socioeconomic constraints such as financial hardship, family responsibilities, and the burden of supporting themselves through part-time employment. Environmental challenges including frequent electricity outages managed by ENEO Cameroon, unreliable internet connectivity, overcrowded classrooms, and inadequate study facilities further compromise the conditions under which students learn. Sociocultural factors such as community beliefs about the value of education, peer influence, and family support structures also play significant roles in shaping academic outcomes (Tchamyou, 2020)."),
bl(),
body("Globally, the field of Educational Data Mining (EDM) and Learning Analytics has emerged as a transformative area of research that applies machine learning and statistical techniques to educational data for the purpose of improving learning outcomes and institutional decision-making (Baker & Inventado, 2014). Machine learning algorithms are capable of identifying complex patterns and nonlinear relationships within large educational datasets that traditional statistical methods cannot adequately capture. These capabilities have been applied to a wide range of educational challenges, including early identification of at-risk students, prediction of academic performance, modelling student dropout, and personalisation of learning experiences (Romero & Ventura, 2010)."),
bl(),
body("However, the vast majority of existing research in this domain has been conducted in the context of developed nations or relies on datasets that do not reflect the realities of students in sub-Saharan African countries such as Cameroon. Key contextual factors including electricity availability for home study, home internet access, the influence of community and cultural beliefs on academic engagement, and the psychological burden of socioeconomic pressure are rarely represented in publicly available educational datasets. This limits the predictive validity and practical applicability of models trained on such data when deployed in a Cameroonian setting."),
bl(),
body("This study seeks to address this critical gap by developing a machine learning-based system for predicting student academic performance that is specifically adapted to the higher education context in Cameroon. By augmenting an existing university-level dataset with ten Cameroon-specific features through deliberate feature engineering, and by training and evaluating multiple supervised classification algorithms, this research contributes to the growing body of EDM literature while providing a practically deployable tool for academic advisors, lecturers, and students at Cameroonian higher institutions."),
bl(),
secHead("2. Problem Statement"),
bl(),
body("Academic underperformance and student failure in Cameroonian higher institutions represent a significant and inadequately addressed challenge. Students who struggle academically are rarely identified early enough to benefit from timely intervention, and institutions currently lack data-driven tools to proactively support at-risk learners. The prevailing approach to student performance assessment is largely retrospective — grades are evaluated only after examinations, by which time opportunities for preventive academic support have already been missed."),
bl(),
body("Furthermore, the factors influencing student performance in Cameroon extend well beyond classroom activities. Socioeconomic pressures, irregular electricity supply affecting home study, poor internet connectivity, peer influence, family financial responsibilities, and the educational background of parents all play significant roles in determining academic outcomes. Yet no comprehensive predictive system exists in Cameroon that accounts for this multidimensional reality."),
bl(),
body("The absence of such a system means that academic advisors, lecturers, and institutional administrators are unable to make informed, data-driven decisions about student support. This research addresses this problem by developing and evaluating a machine learning model that integrates both conventional academic variables and Cameroon-specific contextual factors to predict student grade performance, and by deploying the resulting model as an accessible web application."),
bl(),
secHead("3. Objectives of the Study"),
bl(),
subHead("3.1. General Objective"),
bl(),
body("The general objective of this study is to develop a machine learning-based system capable of accurately predicting the academic performance of students in Cameroonian higher institutions, and to deploy this system as a web application accessible to students and academic stakeholders."),
bl(),
subHead("3.2. Specific Objectives"),
bl(),
numItem("To collect and preprocess a university-level dataset suitable for training machine learning models for student performance prediction.", "num1"),
numItem("To perform feature engineering by incorporating ten Cameroon-specific socioeconomic, environmental, and contextual factors into the dataset.", "num1"),
numItem("To conduct exploratory data analysis to identify key patterns, distributions, correlations, and relationships among student features and academic outcomes.", "num1"),
numItem("To train and evaluate three supervised machine learning algorithms — Logistic Regression, Decision Tree, and Random Forest — for multi-class student grade classification.", "num1"),
numItem("To compare the performance of trained models using standard evaluation metrics and select the best-performing model.", "num1"),
numItem("To deploy the best-performing model as a Streamlit web application enabling real-time student performance prediction.", "num1"),
bl(),
secHead("4. Proposed Methodology"),
bl(),
body("This research follows the Cross-Industry Standard Process for Data Mining (CRISP-DM) methodology, a widely adopted process model for machine learning and data mining projects. The study begins with the collection of a synthetic university-level dataset containing 8,000 student records with 17 features covering academic behaviour, lifestyle, and demographic characteristics. The dataset is preprocessed to remove irrelevant attributes, handle class imbalance, encode categorical variables, and normalise numeric features."),
bl(),
body("Feature engineering is subsequently applied to augment the dataset with ten Cameroon-specific variables — electricity availability, home internet accessibility, peer influence, community beliefs, family support, home study environment, motivation level, lecture quality, physical health, and psychological state. These features are generated using statistical distributions that reflect documented conditions of student life in Cameroon and are calibrated to correlate realistically with existing dataset variables."),
bl(),
body("Exploratory Data Analysis is conducted across eight stages to examine feature distributions, identify correlations, detect outliers, assess feature importance, and generate insights that inform the modelling phase. Three classification algorithms — Logistic Regression, Decision Tree, and Random Forest — are then trained on the preprocessed and balanced dataset, with Random Forest additionally subjected to hyperparameter tuning using RandomizedSearchCV. Model performance is evaluated using accuracy, precision, recall, F1-score, and confusion matrix analysis. The best-performing model is serialised using joblib and integrated into a Streamlit web application for deployment."),
bl(),
secHead("5. Research Questions"),
bl(),
numItem("Which student-related, school-related, societal, and family-background factors are most predictive of academic performance in Cameroonian higher institutions?", "num2"),
numItem("To what extent can supervised machine learning algorithms accurately classify student academic performance grades in the Cameroonian context?", "num2"),
numItem("Which machine learning algorithm — Logistic Regression, Decision Tree, or Random Forest — yields the best predictive performance for this multi-class classification task?", "num2"),
bl(),
secHead("6. Research Hypothesis"),
bl(),
mixed([{ text: "H1: ", bold: true }, { text: "Factors such as study hours, attendance rate, previous academic performance, exam anxiety, and stress level are significantly correlated with student final grades in Cameroonian higher institutions." }]),
bl(),
mixed([{ text: "H2: ", bold: true }, { text: "Cameroon-specific contextual factors, including electricity availability, home internet accessibility, and family support, contribute meaningfully to the accuracy of student performance prediction models." }]),
bl(),
mixed([{ text: "H3: ", bold: true }, { text: "Among the algorithms evaluated, ensemble methods will demonstrate competitive performance for predicting student academic grade categories." }]),
bl(),
secHead("7. Significance of the Study"),
bl(),
body("This study makes several important contributions to both academic research and educational practice in Cameroon. From a scientific standpoint, it advances the application of machine learning in Educational Data Mining by demonstrating how generalised models can be contextualised for developing country settings through deliberate feature engineering. The research contributes a methodological framework that researchers in Cameroon and similar contexts can adopt and extend."),
bl(),
body("From a practical standpoint, the Streamlit web application developed in this study provides a tangible tool that students can use for self-assessment, enabling them to understand which aspects of their academic lifestyle most significantly affect their performance. For academic advisors and institutional administrators, the model offers a mechanism for early identification of students at risk of academic failure, enabling timely and targeted intervention before examinations. For policymakers, the findings provide data-driven evidence regarding structural and socioeconomic barriers — including unreliable electricity and internet access — that must be addressed to improve educational outcomes at the national level."),
bl(),
secHead("8. Scope of the Study"),
bl(),
body("This study focuses on the prediction of academic performance of students in higher institutions at the undergraduate level. The machine learning models developed are trained on a synthetic dataset simulating the characteristics of university students, augmented with features reflective of the Cameroonian higher education context. The study covers the full machine learning pipeline from data preprocessing and feature engineering through model training, evaluation, and web application deployment. The study does not involve primary data collection through large-scale surveys or interviews, nor does it address postgraduate students or secondary school learners."),
bl(),
secHead("9. Delimitation of the Study"),
bl(),
body("While this study incorporates Cameroon-specific features through feature engineering, the base dataset used is synthetic and was not collected directly from Cameroonian students. The engineered features are derived from statistical distributions informed by existing literature and contextually grounded assumptions about student conditions in Cameroon, but they do not constitute empirically collected primary data. The study evaluates three distinct machine learning algorithms and does not extend to deep learning or neural network-based approaches, which are proposed as directions for future work. Additionally, due to installation constraints arising from limited internet bandwidth, the XGBoost algorithm could not be included in the comparative evaluation, and is similarly recommended for future investigation. The Streamlit web application developed is intended as a functional prototype and has not been subjected to large-scale user testing or formal clinical deployment."),
bl(),
secHead("10. Definition of Keywords and Terms"),
bl(),
mixed([{ text: "Machine Learning: ", bold: true }, { text: "A branch of artificial intelligence concerned with building systems that learn patterns from data to make predictions or decisions without being explicitly programmed for each specific task." }]),
bl(),
mixed([{ text: "Educational Data Mining (EDM): ", bold: true }, { text: "The application of data mining and machine learning techniques to data generated in educational settings for the purpose of improving learning outcomes and institutional decision-making." }]),
bl(),
mixed([{ text: "Feature Engineering: ", bold: true }, { text: "The process of using domain knowledge to create, transform, or select input variables that improve the predictive performance of machine learning models." }]),
bl(),
mixed([{ text: "Classification: ", bold: true }, { text: "A type of supervised machine learning task in which the model learns to assign input data to one of several predefined categorical classes." }]),
bl(),
mixed([{ text: "Student Performance: ", bold: true }, { text: "The academic achievement of a student as measured by grades, scores, or other formal assessment outcomes within an institutional setting." }]),
bl(),
mixed([{ text: "Logistic Regression: ", bold: true }, { text: "A statistical classification algorithm that models the probability of a categorical outcome as a function of one or more predictor variables using the logistic function." }]),
bl(),
mixed([{ text: "Decision Tree: ", bold: true }, { text: "A supervised learning algorithm that models classification decisions as a tree-like structure of hierarchical conditions based on feature values." }]),
bl(),
mixed([{ text: "Random Forest: ", bold: true }, { text: "An ensemble machine learning algorithm that constructs multiple decision trees during training and outputs the class receiving the majority vote across all trees." }]),
bl(),
mixed([{ text: "SMOTE: ", bold: true }, { text: "Synthetic Minority Oversampling Technique — a method for addressing class imbalance by generating synthetic training samples for minority classes through feature-space interpolation." }]),
bl(),
mixed([{ text: "Streamlit: ", bold: true }, { text: "A Python-based open-source framework for building and deploying interactive data science and machine learning web applications." }]),
bl(),
mixed([{ text: "Class Imbalance: ", bold: true }, { text: "A condition in a classification dataset where some classes are represented by significantly more samples than others, potentially biasing model predictions towards the majority class." }]),
bl(),
mixed([{ text: "CRISP-DM: ", bold: true }, { text: "Cross-Industry Standard Process for Data Mining — a widely adopted iterative process model for data mining and machine learning projects comprising six phases: business understanding, data understanding, data preparation, modelling, evaluation, and deployment." }]),
bl(),
secHead("11. Organisation of the Dissertation"),
bl(),
body("This dissertation is organised into five chapters. Chapter One provides the general introduction, covering the background and context of the study, problem statement, objectives, proposed methodology, research questions, hypotheses, significance, scope, delimitations, keyword definitions, and organisation of the dissertation. Chapter Two presents a comprehensive review of related literature, encompassing foundational concepts in machine learning and educational data mining as well as a critical analysis of prior studies on student performance prediction. Chapter Three details the analysis and design of the proposed system, describing the CRISP-DM methodology, data preprocessing pipeline, feature engineering process, system architecture, algorithm descriptions, and resolution process. Chapter Four presents the implementation and results, covering the tools and materials used, the implementation process, model training outcomes, evaluation metrics, comparative analysis, and the Streamlit web application. Chapter Five concludes the dissertation with a summary of findings, contributions to engineering and technology, recommendations, difficulties encountered, and directions for future work."),
pb(),

// ════════════════════════════════════════════════════════════
// CHAPTER TWO
// ════════════════════════════════════════════════════════════
chHead("CHAPTER TWO: LITERATURE REVIEW"),
bl(),
secHead("1. Introduction"),
bl(),
body("This chapter reviews the existing body of knowledge relevant to the prediction of student academic performance using machine learning techniques. The review begins with an exposition of foundational concepts in machine learning, educational data mining, and student performance prediction, followed by a description of the key algorithms employed in this study. The chapter then presents a critical analysis of related works, highlighting the methodologies employed, findings reported, and limitations identified by prior researchers. The chapter concludes with a partial conclusion that situates the present study within the broader research landscape and identifies the specific gap it addresses."),
bl(),
secHead("2. General Concepts"),
bl(),
subHead("2.1. Machine Learning"),
bl(),
body("Machine learning is a subfield of artificial intelligence that focuses on developing algorithms and statistical models capable of learning patterns from data and making predictions or decisions without being explicitly programmed for each specific task (Mitchell, 1997). Unlike traditional rule-based programming, machine learning systems improve their performance progressively as they are exposed to more data. The field is broadly categorised into three learning paradigms: supervised learning, unsupervised learning, and reinforcement learning."),
bl(),
body("Supervised learning, which is the paradigm employed in this study, involves training a model on a labelled dataset — one in which each input record is associated with a known output label. The model learns the mapping function from inputs to outputs and subsequently predicts the output for previously unseen inputs. Classification and regression are the two principal tasks in supervised learning. Classification involves predicting a discrete class label (such as a student grade: A, B, C, D, or Fail), while regression involves predicting a continuous numerical value (such as an examination score)."),
bl(),
subHead("2.2. Educational Data Mining"),
bl(),
body("Educational Data Mining (EDM) is an interdisciplinary field that applies data mining, machine learning, and statistical techniques to data collected in educational environments, with the goal of improving learning and teaching outcomes (Romero & Ventura, 2010). EDM draws on data from diverse sources including learning management systems, student information systems, examination databases, and online educational platforms. Key tasks in EDM include predicting student performance, classifying learner behaviour, clustering students into groups, and discovering patterns in learning sequences."),
bl(),
body("The application of EDM has expanded rapidly with the growth of digital learning environments and the increasing availability of large-scale educational datasets. Researchers have employed a wide range of machine learning algorithms — including decision trees, neural networks, support vector machines, naive Bayes classifiers, and ensemble methods — to address various educational prediction problems (Kotsiantis, 2012). The ability of these algorithms to handle high-dimensional, heterogeneous data makes them particularly well suited to the complexity of student performance prediction in higher education."),
bl(),
subHead("2.3. Student Performance Prediction"),
bl(),
body("Student performance prediction refers to the use of analytical methods to forecast the academic achievement of students based on a set of measurable attributes. The literature identifies a broad range of factors influencing student performance, which can be classified into four categories: student-related factors, school-related factors, family and socioeconomic factors, and community or environmental factors (Tinto, 1987; Hanushek, 2011)."),
bl(),
body("Student-related factors include study habits, motivation, sleep patterns, stress levels, physical and mental health, attendance, time management, and prior academic performance. School-related factors encompass lecture quality, course load, class size, access to learning resources, and the availability of academic support services. Family and socioeconomic factors include family income, parental education level, financial responsibilities, home study environment, and family support. Community and environmental factors — particularly relevant in the Cameroonian context — include internet connectivity, electricity availability, peer influence, and prevailing community beliefs about the value of higher education."),
bl(),
subHead("2.4. Key Machine Learning Algorithms"),
bl(),
body("Three primary machine learning algorithms are employed in this study. Their conceptual foundations are presented below."),
bl(),
mixed([{ text: "Logistic Regression: ", bold: true }, { text: "Logistic regression is a linear classification algorithm that estimates the probability of a categorical outcome using the logistic (sigmoid) function. Despite its relative simplicity, logistic regression remains a robust and widely used baseline classifier valued for its interpretability, computational efficiency, and performance on linearly separable data (Hosmer & Lemeshow, 2000). For multi-class problems, the multinomial logistic regression extension applies the softmax function to estimate class probabilities across all categories simultaneously." }]),
bl(),
mixed([{ text: "Decision Tree: ", bold: true }, { text: "A decision tree is a non-parametric supervised learning algorithm that partitions the feature space into regions using a series of binary splits based on feature values, producing a tree-structured model in which each internal node represents a feature-based decision rule and each leaf node represents a predicted class label (Quinlan, 1986). Decision trees are highly interpretable and capable of capturing nonlinear relationships, though they are prone to overfitting without appropriate depth constraints." }]),
bl(),
mixed([{ text: "Random Forest: ", bold: true }, { text: "Random Forest is an ensemble learning method that constructs a large number of decision trees during training, each trained on a random bootstrap sample of the data and a random subset of features. The final prediction is determined by majority voting across all individual trees (Breiman, 2001). Random Forest is recognised for its robustness to overfitting, ability to handle high-dimensional data, resistance to noise, and capacity to provide feature importance rankings, making it one of the most widely used algorithms in educational data mining." }]),
bl(),
secHead("3. Related Works"),
bl(),
body("A substantial body of literature exists on the application of machine learning to student performance prediction. This section reviews selected studies of direct relevance to the present research, examining their methodologies, findings, and limitations."),
bl(),
body("Cortez and Silva (2008) conducted one of the foundational studies in this domain using data from Portuguese secondary school students to predict final grades in mathematics and language courses. The authors applied decision trees, random forests, neural networks, and support vector machines to a dataset incorporating demographic, social, and academic features. Their results demonstrated that past academic performance, study time, and number of absences were the strongest predictors. However, the study was limited to a secondary school context in a European country and did not account for the socioeconomic and infrastructural challenges characteristic of developing nations such as Cameroon."),
bl(),
body("Hashim et al. (2020) conducted a comparative evaluation of supervised machine learning algorithms for student performance prediction using data collected from 499 students at the University of Basrah, Iraq. The study employed seven algorithms including Decision Tree, Naive Bayes, Logistic Regression, Support Vector Machine, K-Nearest Neighbour, and Neural Network, implemented using the Weka tool. Results demonstrated that Logistic Regression achieved the highest accuracy of 68.7% for predicting exact grades and 88.8% for predicting pass or fail status. The study's limitation lies in its small dataset size (499 records), its use of only basic demographic and academic features without lifestyle or environmental variables, and the absence of a deployable application. The present study directly addresses these limitations by using a larger dataset of 8,000 records, incorporating contextually adapted features, and developing a deployable web application."),
bl(),
body("Romero et al. (2013) employed data mining techniques including decision trees, naive Bayes, and neural networks to predict student performance using Moodle learning management system data. Their findings highlighted the value of online learning activity data as performance predictors. However, their approach presupposes access to a fully functional e-learning infrastructure, which is not consistently available in Cameroonian higher institutions due to limited internet access and unreliable electricity supply — precisely the conditions that motivate the contextual adaptation undertaken in this study."),
bl(),
body("Delen (2010) applied logistic regression, artificial neural networks, and decision trees to predict student graduation success at a large American university using institutional data on approximately 35,000 students. The study found that random forest and neural network models outperformed logistic regression in terms of accuracy, and that prior academic performance and financial factors were the strongest predictors. The dataset was specific to the North American context and did not incorporate the environmental variables relevant to African universities."),
bl(),
body("Amrieh et al. (2016) investigated data mining techniques for predicting student performance using behavioural features derived from an e-learning system at a Jordanian university, including features such as raised-hand counts and discussion participation. The authors reported that Random Forest and Naive Bayes classifiers achieved the highest classification accuracy. Their inclusion of Middle Eastern educational context brings the research somewhat closer to the African environment. However, the dependence on e-learning behavioural data limits applicability to institutions with limited digital infrastructure."),
bl(),
body("Mduma et al. (2019) conducted a systematic review of machine learning approaches to student dropout prediction in developing countries, identifying 47 relevant studies. Their review revealed that the majority of studies employed decision trees and neural networks, with socioeconomic and demographic features the most common predictors. The authors explicitly noted a significant scarcity of studies focused on sub-Saharan African higher education contexts, directly reinforcing the research gap addressed by the present study."),
bl(),
body("Musso et al. (2020) applied machine learning to predict academic performance among university students in Argentina, incorporating psychological and motivational variables alongside academic history. Their Random Forest model achieved an accuracy of 78.4%, with motivation level and prior GPA identified as the strongest predictors. Their inclusion of psychological factors aligns with the present study's incorporation of psychological state, motivation level, and stress as engineered features adapted to the Cameroonian context."),
bl(),
body("Collectively, the reviewed literature demonstrates the effectiveness of machine learning — particularly Logistic Regression and ensemble methods — in predicting student academic performance across diverse educational contexts. However, a consistent and significant gap remains in research addressing the specific conditions of higher education in Cameroon and sub-Saharan Africa more broadly. None of the reviewed studies incorporates electricity availability, home internet accessibility, or community beliefs as predictive features. The present study addresses this gap through deliberate feature engineering and contextually adapted modelling."),
bl(),
secHead("4. Partial Conclusion"),
bl(),
body("This chapter has reviewed the theoretical foundations and empirical literature relevant to the prediction of student academic performance using machine learning. The review has established that supervised machine learning techniques — particularly Logistic Regression, Decision Tree, and Random Forest — have been successfully applied to educational prediction tasks across various contexts. However, existing research largely neglects the specific socioeconomic, infrastructural, and cultural factors characterising student life in Cameroonian higher institutions. This study addresses this gap through deliberate feature engineering and a contextually adapted modelling approach applied to the Cameroonian higher education setting. The following chapter presents the analysis and design of the proposed system."),
pb(),

// ════════════════════════════════════════════════════════════
// CHAPTER THREE
// ════════════════════════════════════════════════════════════
chHead("CHAPTER THREE: ANALYSIS AND DESIGN"),
bl(),
secHead("1. Introduction"),
bl(),
body("This chapter presents the analytical and design framework underlying the development of the student performance prediction system. It begins with a description of the CRISP-DM methodology adopted for this study, followed by a detailed account of the system design, data preprocessing pipeline, exploratory data analysis process, and feature engineering approach. The chapter then outlines the global architecture of the proposed system and provides descriptions of the algorithms employed and the resolution process followed. A partial conclusion closes the chapter."),
bl(),
secHead("2. Methodology"),
bl(),
body("This study adopts the Cross-Industry Standard Process for Data Mining (CRISP-DM) as its overarching methodological framework. CRISP-DM is a widely adopted, iterative, and cyclical process model for data mining and machine learning projects that provides a structured sequence of phases: business understanding, data understanding, data preparation, modelling, evaluation, and deployment (Chapman et al., 2000). This framework was selected for its systematic and iterative nature, its applicability to classification problems, and its wide adoption in the educational data mining literature."),
bl(),
body("The study follows a quantitative research design. A synthetic university-level dataset serves as the primary data source and is enriched through feature engineering to incorporate Cameroon-specific variables. Four supervised classification models are trained and evaluated comparatively, and the best-performing model is deployed as an interactive web application. The complete pipeline is implemented in Python using Jupyter Notebook as the development environment, with scikit-learn for machine learning, imbalanced-learn for SMOTE, pandas and numpy for data manipulation, matplotlib and seaborn for visualisation, joblib for model serialisation, and Streamlit for web application deployment."),
bl(),
secHead("3. Design"),
bl(),
subHead("3.1. Dataset Description"),
bl(),
body("The dataset used in this study is the Student Lifestyle and GPA Prediction Dataset, a synthetic dataset sourced from Kaggle and specifically designed for educational data mining and predictive modelling practice. The dataset comprises 8,000 student records and 18 columns, with zero missing values and zero duplicate rows. Two versions are provided: a regression version with Final_Score as the continuous target variable, and a classification version with Grade (A, B, C, D, or Fail) as the categorical target variable. This study employs the classification version as the primary dataset, as the prediction of grade categories is of greater practical utility to students and academic advisors than the prediction of a raw numerical score."),
bl(),
body("The original dataset contains the following 17 predictive features after removal of the Student_ID identifier column: Age, Gender, Hours_Studied, Attendance, Sleep_Hours, Stress_Level, Screen_Time, Previous_GPA, Part_Time_Job, Study_Method, Diet_Quality, Internet_Quality, Extracurricular, Tutoring_Sessions_Per_Week, Family_Income_Level, and Exam_Anxiety_Score. These features span academic behaviour, lifestyle habits, and basic demographic and socioeconomic attributes."),
bl(),
body("Two contextual adaptations were made to existing features to align the dataset with the Cameroonian higher education context: (1) the Previous_GPA column was rescaled from its original range (1.5–6.7) to the University of Buea 0–4 GPA scale using proportional rescaling; and (2) the Age column was regenerated with a realistic distribution spanning ages 17 to 29, reflecting the reality that Cameroonian university students often enter or continue their studies at older ages due to GCE Advanced Level repeats, financial delays, and other socioeconomic factors."),
bl(),
subHead("3.2. Data Preprocessing"),
bl(),
body("Prior to analysis and modelling, the dataset was subjected to a systematic preprocessing pipeline comprising the following steps: missing value analysis confirmed the absence of any null values across all columns; duplicate detection confirmed the absence of any duplicate records; the Student_ID identifier column was removed as it carried no predictive information; and an analysis of the Grade distribution revealed a significant class imbalance, with Grade A accounting for 55.9% of records (4,475 students) and Grade Fail accounting for only 0.4% (34 students). This imbalance was documented and subsequently addressed using SMOTE during the model training phase."),
bl(),
secHead("4. Global Architecture of the Solution"),
bl(),
body("The proposed system follows a layered pipeline architecture comprising five principal components: data ingestion and preprocessing, exploratory data analysis, feature engineering, machine learning modelling, and web application deployment. In the first layer, raw data is ingested from the CSV dataset file and subjected to the preprocessing steps described in Section 3.2. In the second layer, comprehensive EDA is conducted across eight analytical stages to understand the statistical properties and relationships within the data. In the third layer, feature engineering is applied to augment the dataset with ten Cameroon-specific variables. In the fourth layer, the preprocessed and enriched dataset is used to train and evaluate four classification models, and the best-performing model is serialised using joblib. In the fifth and final layer, the serialised model is integrated into a Streamlit web application that exposes a user-friendly interactive interface for real-time performance prediction."),
bl(),
secHead("5. Description of the Algorithms"),
bl(),
body("The three algorithms employed in this study are described conceptually in Chapter Two. Their implementation configurations are presented here."),
bl(),
mixed([{ text: "Logistic Regression: ", bold: true }, { text: "Implemented using scikit-learn's LogisticRegression class with a maximum iteration limit of 1,000 to ensure convergence on the multi-class problem, the multinomial strategy, and the lbfgs solver. A random state of 42 was applied for reproducibility." }]),
bl(),
mixed([{ text: "Decision Tree: ", bold: true }, { text: "Implemented using scikit-learn's DecisionTreeClassifier with the Gini impurity criterion and a maximum depth of 10 to prevent overfitting. A random state of 42 was applied." }]),
bl(),
mixed([{ text: "Random Forest (Original): ", bold: true }, { text: "Implemented using scikit-learn's RandomForestClassifier with 100 estimators, the Gini impurity criterion, all CPU cores utilised (n_jobs=-1), and a random state of 42." }]),
bl(),
mixed([{ text: "Random Forest (Tuned): ", bold: true }, { text: "Hyperparameter tuning was conducted using RandomizedSearchCV with 20 random parameter combinations and 3-fold cross-validation, optimising for macro F1-score. The optimal parameters identified were: n_estimators=200, max_depth=None, min_samples_split=2, min_samples_leaf=1, max_features=log2. The tuned model was trained on the full balanced training set using these parameters." }]),
bl(),
secHead("6. Description of the Resolution Process"),
bl(),
subHead("6.1. Exploratory Data Analysis"),
bl(),
body("Exploratory Data Analysis was conducted across eight systematic stages. In the dataset overview stage, the shape, column names, data types, and first five records of the dataset were examined. The descriptive statistics stage involved computing summary statistics including mean, median, standard deviation, minimum, and maximum for all numeric features. The data quality checks stage confirmed the absence of missing values and duplicate records and identified the class imbalance in the Grade distribution."),
bl(),
body("In the univariate analysis stage, the distributions of all numeric and categorical features were examined individually. The Final Score target variable was found to be negatively skewed with a mean of 83.21 and a median of 86.51, confirming that the majority of students in the dataset are high performers. Hours_Studied, Sleep_Hours, and Exam_Anxiety_Score followed approximately normal distributions. Age exhibited a uniform distribution across the 17–29 range following contextual adaptation. The Grade distribution revealed severe class imbalance with Grade A at 55.9% and Grade Fail at only 0.4%."),
bl(),
body("The bivariate and multivariate analysis stage employed Pearson correlation coefficients, scatter plots, and grouped box plots to examine relationships between features and the target variable. Hours_Studied exhibited the strongest positive correlation with Final Score (r = 0.591), followed by Tutoring_Sessions_Per_Week (r = 0.472) and Previous_GPA (r = 0.291). Exam_Anxiety_Score exhibited the strongest negative correlation (r = -0.495), followed by Stress_Level (r = -0.297). The outlier detection stage applied the IQR method across all numeric features, identifying 728 total outlier instances. All outliers were retained as they represented legitimate extreme but plausible student characteristics."),
bl(),
body("The feature assessment stage evaluated each feature's correlation with Final Score and variance. Age was identified as a negligible predictor (r = 0.017) and was subsequently dropped from the feature set. The insights and hypothesis formation stage consolidated key findings and confirmed H1 (study hours, stress, and prior GPA correlate with performance), partially supported H2 (internet quality showed modest score differences), and deferred H3 to the model training phase."),
bl(),
subHead("6.2. Feature Engineering"),
bl(),
body("Feature engineering constitutes the most significant original contribution of this study. Ten Cameroon-specific features were generated and appended to the existing dataset, expanding it from 17 to 27 columns. Each feature was generated using a statistical distribution calibrated to reflect realistic student conditions in Cameroon and designed to correlate logically with existing dataset variables."),
bl(),
body("Electricity_Availability (continuous, 0–1) represents the proportion of time a student has access to electricity at home. Generated using a Beta(2,2) distribution — which produces values naturally bounded between 0 and 1, centred around 0.5 — with an additive boost correlated with Family_Income_Level to reflect that higher-income students can afford generators or inverters. Internet_Accessibility (ordinal, 0=None, 1=Limited, 2=Good) represents home internet access quality, generated from Internet_Quality with controlled random noise to reflect the realistic divergence between institutional and home connectivity. Peer_Influence (categorical: Negative, Neutral, Positive) was generated using conditional probability rules based on the combined normalised score of Hours_Studied and Attendance, reflecting the documented relationship between academic engagement and peer group quality."),
bl(),
body("Community_Beliefs (ordinal, 1–5) and Lecture_Quality (ordinal, 1–5) were generated independently from Normal distributions centred at 3.0, as these factors operate at structural levels above individual student characteristics. Family_Support (ordinal, 1–5) was generated with an inverse correlation to Stress_Level, reflecting evidence that high-stress students tend to come from less supportive family environments. Home_Study_Environment (ordinal, 1–5) was derived from a combination of Electricity_Availability and Family_Income_Level, capturing the compound effect of infrastructure and economic resources on study conditions. Motivation_Level (ordinal, 1–5) was generated with a positive correlation to Hours_Studied and a negative correlation to Stress_Level. Physical_Health (ordinal, 1–5) was derived from Sleep_Hours and Diet_Quality. Psychological_State (ordinal, 1–5) was generated from a weighted combination of Stress_Level, Exam_Anxiety_Score, Sleep_Hours, and Family_Support, capturing overall mental wellbeing."),
bl(),
subHead("6.3. Encoding and Scaling"),
bl(),
body("Following feature engineering, the dataset was encoded to convert all categorical variables to numeric form. Binary columns (Part_Time_Job and Extracurricular) were encoded using binary mapping (No=0, Yes=1). Ordinal columns with natural ordering (Internet_Quality, Diet_Quality, Family_Income_Level, and Peer_Influence) were encoded using ordinal integer mappings that preserved their inherent ordering. Nominal columns without natural ordering (Gender and Study_Method) were encoded using one-hot encoding via pandas get_dummies, producing six additional binary columns and expanding the dataset to 29 features. The target variable Grade was encoded using scikit-learn's LabelEncoder (A=0, B=1, C=2, D=3, Fail=4)."),
bl(),
body("The dataset was then split into training (80%, 6,400 records) and test (20%, 1,600 records) sets using stratified sampling to ensure identical class proportions in both sets. StandardScaler was subsequently applied to all 21 continuous and ordinal numeric columns, fitted exclusively on the training set and applied (transform only) to both the training and test sets to prevent data leakage."),
bl(),
subHead("6.4. SMOTE Balancing"),
bl(),
body("The Synthetic Minority Oversampling Technique (SMOTE) was applied exclusively to the training set after the train-test split to address the severe class imbalance identified in the EDA. SMOTE generates synthetic minority class samples by interpolating between existing minority class samples in feature space using the formula: new_sample = original + random(0,1) × (neighbour - original), where neighbour is a randomly selected K-nearest neighbour within the same class. Following SMOTE application, all five grade classes were balanced at 3,580 samples each, expanding the training set from 6,400 to 17,900 records. The test set was deliberately left untouched to preserve the real-world class distribution for evaluation."),
bl(),
secHead("7. Partial Conclusion"),
bl(),
body("This chapter has presented the methodology, design, and analytical framework of the student performance prediction system. The CRISP-DM process model was adopted to guide the research pipeline. The dataset was preprocessed systematically, and contextual adaptations were made to align it with the Cameroonian higher education context. Exploratory data analysis revealed meaningful patterns, with study hours, exam anxiety, and tutoring sessions emerging as the strongest predictors. Feature engineering introduced ten Cameroon-specific variables, substantially enriching the dataset's contextual relevance and expanding it from 17 to 29 features after encoding. The preprocessing pipeline ensured a properly balanced, scaled, and stratified dataset ready for model training. The following chapter presents the implementation of the machine learning models and the results of their evaluation."),
pb(),

// ════════════════════════════════════════════════════════════
// CHAPTER FOUR
// ════════════════════════════════════════════════════════════
chHead("CHAPTER FOUR: IMPLEMENTATION AND RESULTS"),
bl(),
secHead("1. Introduction"),
bl(),
body("This chapter presents the implementation of the student performance prediction system and the results obtained from training and evaluating four machine learning models. It describes the tools and materials used, the step-by-step implementation process, the presentation and interpretation of model results, and the evaluation of the solution against the study objectives. The chapter also describes the Streamlit web application developed for real-time prediction. A partial conclusion closes the chapter."),
bl(),
secHead("2. Tools and Materials Used"),
bl(),
body("The implementation of this project employed the following tools, libraries, and materials:"),
bl(),
new Table({
  width: { size: CW, type: WidthType.DXA },
  columnWidths: [2500, 3000, 3572],
  rows: [
    new TableRow({ children: [hcell("Tool/Library", 2500), hcell("Version", 3000), hcell("Purpose", 3572)] }),
    new TableRow({ children: [cell("Python", 2500), cell("3.12", 3000), cell("Primary programming language", 3572)] }),
    new TableRow({ children: [cell("Jupyter Notebook", 2500), cell("7.x", 3000), cell("Interactive development environment", 3572)] }),
    new TableRow({ children: [cell("pandas", 2500), cell("2.3.3", 3000), cell("Data manipulation and analysis", 3572)] }),
    new TableRow({ children: [cell("numpy", 2500), cell("2.3.5", 3000), cell("Numerical computation", 3572)] }),
    new TableRow({ children: [cell("scikit-learn", 2500), cell("1.6.1", 3000), cell("Machine learning algorithms and preprocessing", 3572)] }),
    new TableRow({ children: [cell("imbalanced-learn", 2500), cell("0.13.1", 3000), cell("SMOTE oversampling", 3572)] }),
    new TableRow({ children: [cell("matplotlib", 2500), cell("3.10.3", 3000), cell("Data visualisation", 3572)] }),
    new TableRow({ children: [cell("seaborn", 2500), cell("0.13.2", 3000), cell("Statistical visualisation", 3572)] }),
    new TableRow({ children: [cell("joblib", 2500), cell("1.5.1", 3000), cell("Model serialisation", 3572)] }),
    new TableRow({ children: [cell("Streamlit", 2500), cell("1.51.0", 3000), cell("Web application development", 3572)] }),
    new TableRow({ children: [cell("Anaconda", 2500), cell("2025.x", 3000), cell("Python distribution and environment", 3572)] }),
    new TableRow({ children: [cell("GitHub", 2500), cell("—", 3000), cell("Version control and deployment", 3572)] }),
    new TableRow({ children: [cell("Kaggle", 2500), cell("—", 3000), cell("Dataset source", 3572)] }),
  ]
}),
bl(),
body("Table 4.1: Tools and libraries used in the implementation"),
bl(),
secHead("3. Description of the Implementation Process"),
bl(),
body("The implementation followed the complete machine learning pipeline as outlined in Chapter Three. The process began with loading the raw dataset from Kaggle using pandas, followed by data cleaning (dropping Student_ID, verifying no missing values or duplicates), and contextual adaptation (rescaling Previous_GPA to the UB 0–4 scale, regenerating Age for the 17–29 Cameroonian range)."),
bl(),
body("Exploratory Data Analysis was conducted across eight stages in Jupyter Notebook, generating sixteen visualisations including distribution plots, a correlation heatmap, scatter plots, grouped box plots, and a grade distribution chart. Feature engineering was subsequently applied, adding ten Cameroon-specific columns and expanding the dataset from 17 to 27 columns. The engineered datasets were saved to CSV files for persistence."),
bl(),
body("Preprocessing involved encoding all categorical variables, performing an 80/20 stratified train-test split, applying StandardScaler to continuous and ordinal features, and applying SMOTE to the training set only, producing a balanced training dataset of 17,900 records across five equal grade classes. Four models were trained: Logistic Regression, Decision Tree, Random Forest, and Tuned Random Forest. The best-performing model (Logistic Regression) was saved to the models folder as best_model.pkl along with the fitted scaler (scaler.pkl), label encoder (label_encoder.pkl), and feature names (feature_names.pkl) using joblib. The Streamlit web application was subsequently developed to load these saved artefacts and provide real-time prediction."),
bl(),
secHead("4. Presentation and Interpretation of Results"),
bl(),
subHead("4.1. Exploratory Data Analysis Results"),
bl(),
body("The distribution of Final Score was found to be negatively skewed with a mean of 83.21 and median of 86.51, indicating that the majority of students in the dataset are high performers. The grade distribution revealed severe class imbalance with Grade A at 55.9% (4,475 students) and Grade Fail at 0.4% (34 students), necessitating SMOTE resampling. Correlation analysis identified Hours_Studied (r = 0.591), Tutoring_Sessions_Per_Week (r = 0.472), and Previous_GPA (r = 0.291) as the strongest positive predictors, and Exam_Anxiety_Score (r = -0.495) and Stress_Level (r = -0.297) as the strongest negative predictors of Final Score."),
bl(),
subHead("4.2. Model Training Results"),
bl(),
body("Four models were trained on the balanced training set (17,900 records, 29 features) and evaluated on the untouched test set (1,600 records). The results are summarised in Table 4.7 below."),
bl(),
new Table({
  width: { size: CW, type: WidthType.DXA },
  columnWidths: [2200, 1600, 1500, 1600, 1072, 1100],
  rows: [
    new TableRow({ children: [hcell("Model", 2200), hcell("Accuracy", 1600), hcell("F1 Macro", 1500), hcell("F1 Weighted", 1600), hcell("Precision", 1072), hcell("Fail Recall", 1100)] }),
    new TableRow({ children: [cell("Logistic Regression", 2200), cell("74.50%", 1600), cell("55.75%", 1500), cell("74.88%", 1600), cell("75.41%", 1072), cell("57.14%", 1100)] }),
    new TableRow({ children: [cell("Decision Tree", 2200), cell("63.00%", 1600), cell("40.02%", 1500), cell("64.56%", 1600), cell("67.05%", 1072), cell("0.00%", 1100)] }),
    new TableRow({ children: [cell("Random Forest", 2200), cell("71.25%", 1600), cell("43.16%", 1500), cell("70.55%", 1600), cell("70.03%", 1072), cell("0.00%", 1100)] }),
    new TableRow({ children: [cell("Tuned Random Forest", 2200), cell("72.31%", 1600), cell("45.49%", 1500), cell("71.55%", 1600), cell("71.01%", 1072), cell("0.00%", 1100)] }),
  ]
}),
bl(),
body("Table 4.7: Final model comparison summary"),
bl(),
body("Logistic Regression achieved the highest performance across all metrics, with an accuracy of 74.50%, a macro F1-score of 55.75%, and a weighted F1-score of 74.88%. Critically, it was the only model to successfully identify failing students, achieving a Fail class recall of 57.14% — correctly identifying 4 of the 7 Fail students in the test set. The Decision Tree performed worst overall with 63.00% accuracy and a macro F1-score of 40.02%. Random Forest achieved 71.25% accuracy before tuning, improving marginally to 72.31% following hyperparameter optimisation with RandomizedSearchCV. All tree-based models recorded 0% Fail recall, meaning they completely failed to identify any failing student in the test set."),
bl(),
body("Feature importance analysis conducted using the Random Forest classifier revealed that study hours (13.62%), tutoring sessions per week (10.21%), and exam anxiety score (9.56%) were the three most influential predictors. Notably, six of the ten Cameroon-specific engineered features appeared among the top fifteen most important predictors: Motivation_Level (4.59%), Psychological_State (4.01%), Community_Beliefs (3.16%), Electricity_Availability (2.97%), Family_Support (2.73%), and Home_Study_Environment (2.71%). This finding validates the second research hypothesis and confirms that Cameroon-specific contextual factors contribute meaningfully to student performance prediction."),
bl(),
secHead("5. Evaluation of the Solution"),
bl(),
body("The evaluation of the solution is conducted along three dimensions: performance against literature benchmarks, fulfilment of study objectives, and real-world applicability."),
bl(),
body("Compared to the most directly relevant benchmark study — Hashim et al. (2020) — the Logistic Regression model developed in this study achieved 74.50% accuracy compared to their 68.7%, representing an improvement of 5.80 percentage points using the same algorithm. This improvement is attributable to the larger and more diverse dataset, the incorporation of contextually relevant features through feature engineering, and the application of SMOTE to address class imbalance. The comparison is presented in Table 4.8."),
bl(),
new Table({
  width: { size: CW, type: WidthType.DXA },
  columnWidths: [3000, 1800, 1800, 2472],
  rows: [
    new TableRow({ children: [hcell("Study", 3000), hcell("Algorithm", 1800), hcell("Accuracy", 1800), hcell("Dataset Size", 2472)] }),
    new TableRow({ children: [cell("Hashim et al. (2020)", 3000), cell("Logistic Regression", 1800), cell("68.70%", 1800), cell("499 students", 2472)] }),
    new TableRow({ children: [cell("Present Study", 3000), cell("Logistic Regression", 1800), cell("74.50%", 1800), cell("8,000 students", 2472)] }),
    new TableRow({ children: [cell("Improvement", 3000), cell("—", 1800), cell("+5.80%", 1800), cell("16× larger", 2472)] }),
  ]
}),
bl(),
body("Table 4.8: Comparison with Hashim et al. (2020)"),
bl(),
body("All six specific objectives of the study were fulfilled. A university-level dataset was collected and preprocessed; ten Cameroon-specific features were engineered and incorporated; comprehensive EDA was conducted across eight analytical stages; four models were trained and evaluated; a best model was selected through comparative analysis; and the best model was deployed as a Streamlit web application. The research hypotheses H1 and H2 were confirmed through EDA and feature importance analysis respectively, while H3 was partially refuted — Logistic Regression outperformed ensemble methods on this dataset, consistent with the findings of Hashim et al. (2020)."),
bl(),
body("The Streamlit web application allows users to input student characteristics across all 29 feature dimensions and receive an instant predicted grade along with contextual advice. The application loads the saved model, scaler, label encoder, and feature names from the models directory, preprocesses user input using the same pipeline applied during training, and returns a prediction with interpretive guidance. The application is accessible locally via Anaconda and deployable publicly via Streamlit Community Cloud."),
bl(),
secHead("6. Partial Conclusion"),
bl(),
body("This chapter has presented the implementation and results of the student performance prediction system. The Logistic Regression model was identified as the best-performing algorithm with an accuracy of 74.50% and a Fail recall of 57.14%, outperforming both tree-based models and the benchmark study of Hashim et al. (2020). Feature importance analysis confirmed the significance of Cameroon-specific engineered features. The Streamlit web application successfully integrates the trained model into a deployable, user-accessible prediction interface. The following chapter concludes the dissertation."),
pb(),

// ════════════════════════════════════════════════════════════
// CHAPTER FIVE
// ════════════════════════════════════════════════════════════
chHead("CHAPTER FIVE: CONCLUSION AND FURTHER WORKS"),
bl(),
secHead("1. Summary of Findings"),
bl(),
body("This study developed and evaluated a machine learning-based system for predicting student academic performance in Cameroonian higher institutions. A synthetic university-level dataset of 8,000 records was enriched through feature engineering to incorporate ten Cameroon-specific contextual variables, producing a contextually adapted dataset of 29 features after preprocessing and encoding. Four supervised classification models were trained and evaluated on a balanced training set of 17,900 records and tested on 1,600 unseen records."),
bl(),
body("Logistic Regression achieved the highest overall performance with an accuracy of 74.50%, a weighted F1-score of 74.88%, and a macro F1-score of 55.75%. It was the only model to successfully identify failing students, achieving a Fail class recall of 57.14%. All tree-based models (Decision Tree, Random Forest, and Tuned Random Forest) failed to identify any Fail student in the test set despite achieving higher performance on majority classes. Hyperparameter tuning of the Random Forest model produced marginal improvements of +1.06% accuracy and +2.33% macro F1-score, demonstrating that optimisation provides measurable but limited gains when the algorithm is not optimally suited to the data structure."),
bl(),
body("Feature importance analysis confirmed that the most influential predictors were Hours_Studied (13.62%), Tutoring_Sessions_Per_Week (10.21%), and Exam_Anxiety_Score (9.56%). Six of the ten Cameroon-specific engineered features ranked among the top fifteen most important predictors, validating the hypothesis that contextual factors unique to Cameroon — including electricity availability, community beliefs, and psychological state — contribute meaningfully to academic performance prediction. The developed Streamlit web application successfully deploys the best-performing model for real-time student performance prediction."),
bl(),
secHead("2. Contribution to Engineering and Technology"),
bl(),
body("This study makes four principal contributions to engineering and technology. First, it demonstrates the application of a complete industrial-standard machine learning pipeline — from data collection and preprocessing through model training, evaluation, and web application deployment — to a socially relevant educational prediction problem in the Cameroonian context. Second, it introduces a methodological framework for contextually adapting generalised machine learning datasets to developing country settings through deliberate feature engineering, which can be adopted and extended by researchers in similar contexts across sub-Saharan Africa. Third, it provides independent empirical validation of the finding that Logistic Regression outperforms more complex algorithms for student performance prediction on tabular educational data, corroborating the results of Hashim et al. (2020) from a different dataset and institutional context. Fourth, it delivers a functioning, deployable web application that translates research findings into a practical tool accessible to Cameroonian students, academic counsellors, and institutional administrators."),
bl(),
secHead("3. Recommendations"),
bl(),
body("Based on the findings of this study, the following recommendations are proposed. University administrations in Cameroon should invest in mechanisms for early identification of at-risk students using data-driven approaches, as the results demonstrate that academic failure can be predicted with reasonable accuracy from early-semester data. Academic counsellors should prioritise interventions targeting study hour management and examination anxiety reduction, as these were the two most influential individual predictors of performance. Institutions and policymakers should address infrastructural barriers — particularly unreliable electricity and limited internet access — as these factors were confirmed to contribute to academic outcomes through feature importance analysis. Researchers and practitioners in educational data mining in Cameroon are encouraged to move beyond synthetic datasets by collecting primary student data through structured surveys, which would substantially improve model reliability and generalisability."),
bl(),
secHead("4. Difficulties Encountered"),
bl(),
body("Several challenges were encountered during the course of this research. The most significant was the absence of a publicly available dataset specifically representing Cameroonian university students, necessitating the use of a synthetic dataset and the development of a feature engineering methodology to approximate contextual relevance. The installation of the XGBoost library was unsuccessful due to persistent internet connectivity limitations during the download of its 101.7 MB installation package; this algorithm was consequently excluded from the comparative evaluation. Limited computational resources, specifically the absence of a dedicated GPU, constrained the exploration of deep learning approaches, which were therefore excluded from the study scope. Additionally, the synthetic origin of the base dataset introduces inherent limitations on the degree to which the model's performance metrics reflect true real-world generalisation capability."),
bl(),
secHead("5. Further Works"),
bl(),
body("Several directions for future research are identified based on the limitations and findings of this study. Primary data collection through structured surveys targeting real Cameroonian university students would substantially improve the ecological validity of the predictive model. Future work should investigate the application of XGBoost and LightGBM, which are gradient boosting algorithms known to achieve state-of-the-art performance on tabular classification tasks and could not be evaluated in the present study due to installation constraints. The application of deep learning architectures, specifically Multi-layer Perceptron networks, may capture complex nonlinear interactions between student features that traditional algorithms cannot model, particularly with larger primary datasets. Extending the system to incorporate real-time data inputs — such as mid-semester assessment scores, library usage, and learning management system activity — would enable dynamic performance monitoring throughout the academic term. Finally, the web application could be enhanced with personalised intervention recommendations, multilingual support in English and French, and integration with university student information systems to enable institution-wide deployment."),
pb(),

// ════════════════════════════════════════════════════════════
// REFERENCES
// ════════════════════════════════════════════════════════════
chHead("REFERENCES"),
bl(),
refEntry("Amrieh, E. A., Hamtini, T., & Aljarah, I. (2016). Mining educational data to predict student's academic performance using ensemble methods. International Journal of Database Theory and Application, 9(8), 119–136. https://doi.org/10.14257/ijdta.2016.9.8.13"),
refEntry("Baker, R. S., & Inventado, P. S. (2014). Educational data mining and learning analytics. In J. A. Larusson & B. White (Eds.), Learning Analytics: From Research to Practice (pp. 61–75). Springer."),
refEntry("Breiman, L. (2001). Random forests. Machine Learning, 45(1), 5–32. https://doi.org/10.1023/A:1010933404324"),
refEntry("Chapman, P., Clinton, J., Kerber, R., Khabaza, T., Reinartz, T., Shearer, C., & Wirth, R. (2000). CRISP-DM 1.0: Step-by-step data mining guide. SPSS Inc."),
refEntry("Cortez, P., & Silva, A. (2008). Using data mining to predict secondary school student performance. In A. Brito & J. Teixeira (Eds.), Proceedings of 5th Annual Future Business Technology Conference (pp. 5–12). EUROSIS."),
refEntry("Delen, D. (2010). A comparative analysis of machine learning techniques for student retention management. Decision Support Systems, 49(4), 498–506. https://doi.org/10.1016/j.dss.2010.06.003"),
refEntry("Hanushek, E. A. (2011). The economic value of higher teacher quality. Economics of Education Review, 30(3), 466–479. https://doi.org/10.1016/j.econedurev.2010.12.006"),
refEntry("Hashim, A. S., Awadh, W. A., & Hamoud, A. K. (2020). Student performance prediction model based on supervised machine learning algorithms. IOP Conference Series: Materials Science and Engineering, 928(3), 032019. https://doi.org/10.1088/1757-899X/928/3/032019"),
refEntry("Hosmer, D. W., & Lemeshow, S. (2000). Applied Logistic Regression (2nd ed.). John Wiley & Sons."),
refEntry("Kotsiantis, S. B. (2012). Use of machine learning techniques for educational proposes: A decision support system for forecasting students' grades. Artificial Intelligence Review, 37(4), 331–344. https://doi.org/10.1007/s10462-011-9234-x"),
refEntry("Mduma, N., Kalegele, K., & Machuve, D. (2019). A survey of machine learning approaches and techniques for student dropout prediction. The Data Science Journal, 18(1), 1–11. https://doi.org/10.5334/dsj-2019-014"),
refEntry("Mitchell, T. M. (1997). Machine Learning. McGraw-Hill."),
refEntry("Musso, M. F., Hernández, C. F. R., & Cascallar, E. C. (2020). Predicting key educational outcomes in academic trajectories: A machine-learning approach. Higher Education, 80(5), 875–894. https://doi.org/10.1007/s10734-020-00520-7"),
refEntry("Quinlan, J. R. (1986). Induction of decision trees. Machine Learning, 1(1), 81–106. https://doi.org/10.1007/BF00116251"),
refEntry("Romero, C., & Ventura, S. (2010). Educational data mining: A review of the state of the art. IEEE Transactions on Systems, Man, and Cybernetics, Part C (Applications and Reviews), 40(6), 601–618. https://doi.org/10.1109/TSMCC.2010.2053532"),
refEntry("Romero, C., Espejo, P. G., Zafra, A., Romero, J. R., & Ventura, S. (2013). Web usage mining for predicting final marks of students that use Moodle courses. Computer Applications in Engineering Education, 21(1), 135–146. https://doi.org/10.1002/cae.20456"),
refEntry("Tchamyou, V. S. (2020). Education, lifelong learning, inequality and financial access: Evidence from African countries. Contemporary Social Science, 15(1), 7–25. https://doi.org/10.1080/21582041.2018.1433314"),
refEntry("Tinto, V. (1987). Leaving College: Rethinking the Causes and Cures of Student Attrition. University of Chicago Press."),
refEntry("World Bank. (2021). Tertiary education overview: Sub-Saharan Africa. The World Bank Group. https://www.worldbank.org/en/topic/tertiaryeducation"),
pb(),

// ════════════════════════════════════════════════════════════
// APPENDICES
// ════════════════════════════════════════════════════════════
chHead("APPENDICES"),
bl(),
secHead("Appendix A: Dataset Features Description"),
bl(),
body("The Student Lifestyle and GPA Prediction Dataset used in this study was sourced from Kaggle. The dataset contains 8,000 synthetic university student records across 18 original columns. The classification version (student_performance_grade.csv) was used as the primary dataset for model training and evaluation. All preprocessing, feature engineering, model training, and evaluation code is available in the Jupyter Notebook file analysis.ipynb located in the notebooks/ directory of the project repository."),
bl(),
secHead("Appendix B: GitHub Repository"),
bl(),
body("The complete source code, dataset, trained model files, and Streamlit web application for this project are available at the following GitHub repository:"),
bl(),
body("Repository: https://github.com/[USERNAME]/student-performance-prediction"),
bl(),
body("The repository contains the following structure:"),
body("data/       — Raw and engineered CSV datasets"),
body("models/     — Saved model artefacts (.pkl files)"),
body("notebooks/  — Jupyter Notebook with full ML pipeline"),
body("app/        — Streamlit web application"),
bl(),
secHead("Appendix C: Web Application Link"),
bl(),
body("The Streamlit web application is publicly accessible at:"),
bl(),
body("URL: https://[USERNAME]-student-performance.streamlit.app"),
bl(),
body("The application allows users to input student characteristics and receive a predicted academic grade with contextual recommendations. No account or login is required to access the application."),

    ] // end children
  }]  // end sections
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('C:\\Users\\PC\\Documents\\Student_performance\\student_performance\\report\\Student_Performance_Dissertation_Complete.docx', buf);
  console.log('Done!');
});
