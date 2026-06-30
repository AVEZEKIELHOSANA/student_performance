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

const refEntry = (text) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { ...LINE, before: 0, after: 160 },
  indent: { left: 720, hanging: 720 },
  children: [new TextRun({ text, font: FONT, size: BODY })]
});

const numItem = (text, ref) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { ...LINE, before: 0, after: 120 },
  numbering: { reference: ref, level: 0 },
  children: [new TextRun({ text, font: FONT, size: BODY })]
});

const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
const borders = { top: border, bottom: border, left: border, right: border };

const hcell = (text, width) => new TableCell({
  borders,
  width: { size: width, type: WidthType.DXA },
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  shading: { fill: "D9E1F2", type: ShadingType.CLEAR },
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, font: FONT, size: BODY, bold: true })]
  })]
});

const lcell = (text, width, bold = false) => new TableCell({
  borders,
  width: { size: width, type: WidthType.DXA },
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  children: [new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, font: FONT, size: BODY, bold })]
  })]
});

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "n1", levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: 720, hanging: 360 }, spacing: LINE },
            run: { font: FONT, size: BODY }
          }
        }]
      },
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

// ════════════════════════════════════════════════════════════
// CHAPTER FIVE
// ════════════════════════════════════════════════════════════
chHead("CHAPTER FIVE: CONCLUSION AND FURTHER WORKS"),
bl(),

// ── 1. SUMMARY OF FINDINGS ──────────────────────────────────
secHead("1. Summary of Findings"),
bl(),
body("This research developed and evaluated a machine learning-based system for predicting the academic performance of students in Cameroonian higher institutions. The project was motivated by the persistent problem of student academic underperformance and the absence of early-warning predictive tools suited to the specific contextual realities of higher education in Cameroon. The work was conducted in two principal phases: the development of a machine learning prediction pipeline and the deployment of the predictive model as a three-tier web application."),
bl(),
body("In the first phase, a synthetic university-level dataset of 8,000 student records sourced from Kaggle was subjected to a complete machine learning pipeline following the CRISP-DM methodology. The dataset was first adapted to the Cameroonian context through two modifications: the Previous_GPA column was rescaled from a foreign scale to the University of Buea 0 to 4 GPA system, and the Age column was regenerated to reflect the realistic age distribution of Cameroonian university students ranging from 17 to 29 years. The dataset was subsequently enriched through deliberate feature engineering that introduced ten Cameroon-specific contextual variables — electricity availability, home internet accessibility, peer influence, community beliefs, family support, home study environment, motivation level, lecture quality, physical health, and psychological state. These additions expanded the dataset from 17 to 27 columns, representing the primary original scientific contribution of this research."),
bl(),
body("Comprehensive eight-stage exploratory data analysis was conducted, generating sixteen visualisations that revealed key patterns in the data. Study hours emerged as the strongest positive predictor of academic performance (r = 0.591), followed by tutoring sessions per week (r = 0.472) and previous GPA (r = 0.291). Exam anxiety was the strongest negative predictor (r = -0.495), followed by stress level (r = -0.297). A severe class imbalance was identified in the grade distribution, with Grade A accounting for 55.9% of records and the Fail class representing only 0.4%. This imbalance was addressed using the Synthetic Minority Oversampling Technique (SMOTE), which balanced the training set to 3,580 samples per class, producing a final balanced training dataset of 17,900 records."),
bl(),
body("Four machine learning models were trained and evaluated on a stratified 80/20 train-test split. Logistic Regression achieved the highest overall accuracy of 74.50% and was the only model to successfully identify failing students, recording a Fail class recall of 57.14%. The Decision Tree performed worst with 63.00% accuracy and zero Fail recall. The original Random Forest achieved 71.25% accuracy, improving marginally to 72.31% following hyperparameter tuning with RandomizedSearchCV, but still recorded zero Fail recall. Feature importance analysis confirmed that six of the ten Cameroon-specific engineered features ranked among the top fifteen most predictive variables, validating both the contextual adaptation methodology and the second research hypothesis."),
bl(),
body("In the second phase, the best-performing Logistic Regression model was serialised using joblib and integrated into a three-tier web application built with FastAPI as the backend API layer, Streamlit as the frontend presentation layer, and PostgreSQL as the database persistence layer. The application implements full user authentication using JSON Web Tokens, role-based access control for three user types (student, instructor, and administrator), a personalised prediction dashboard with a What-If simulator, student prediction history tracking, instructor batch class prediction with class distribution analytics, administrator user management, and PDF and CSV report export. Of the fourteen functional requirements defined in the Software Requirements Specification, twelve were fully implemented in the Version 1 prototype."),
bl(),

// ── 2. CONTRIBUTION TO ENGINEERING AND TECHNOLOGY ───────────
secHead("2. Contribution to Engineering and Technology"),
bl(),
body("This research makes four principal and distinct contributions to engineering, technology, and the academic field of educational data mining."),
bl(),
subHead("2.1. Cameroon-Specific Feature Engineering Framework"),
bl(),
body("The most significant and original contribution of this study is the development of a methodological framework for contextually adapting generalised machine learning datasets to the Cameroonian higher education setting through deliberate feature engineering. Prior to this research, no published study in the educational data mining literature had incorporated variables specific to the Cameroonian higher education context — including electricity availability under ENEO load shedding conditions, community cultural beliefs about education, or home study environment — into a predictive model for student academic performance. The ten engineered features introduced in this study, six of which ranked among the top fifteen most important predictors in the Random Forest feature importance analysis, demonstrate that contextual adaptation materially improves the representativeness and practical applicability of educational prediction models in developing country settings. This framework can be adopted and extended by researchers across sub-Saharan Africa to contextualise generalised datasets for their own national and institutional contexts."),
bl(),
subHead("2.2. Outperformance of Published Benchmark"),
bl(),
body("The Logistic Regression model developed in this study achieved an accuracy of 74.50% on a test set of 1,600 records — outperforming the most directly comparable published benchmark study (Hashim et al., 2020), which reported 68.7% accuracy using the same algorithm on a dataset of 499 students with eight features. The improvement of 5.80 percentage points, achieved despite using a synthetic rather than primary dataset, is attributable to three factors: the larger and more diverse training dataset, the incorporation of contextually relevant features through feature engineering, and the application of SMOTE to correct the class imbalance. This result provides independent validation that Logistic Regression is a robust and effective algorithm for student performance classification on tabular educational data, corroborating the findings of Hashim et al. (2020) from a different dataset and institutional context."),
bl(),
subHead("2.3. First Failing Student Identification Capability"),
bl(),
body("Among the four models evaluated in this study, Logistic Regression was the only algorithm to successfully identify students at risk of academic failure, achieving a Fail class recall of 57.14% — correctly identifying 4 of the 7 Fail students in the test set. All tree-based models (Decision Tree, Random Forest, and Tuned Random Forest) recorded zero Fail recall despite achieving higher Grade A performance, demonstrating that overall accuracy alone is an insufficient evaluation criterion for educational risk detection systems. For a system whose primary purpose is the early identification of at-risk students, the ability to detect even a subset of failing students constitutes a meaningful practical capability that distinguishes this model from higher-accuracy but operationally blind alternatives. This finding contributes a methodological insight — that Logistic Regression's global linear boundary generalises better to rare real-world failure cases than tree-based ensemble methods trained on SMOTE-balanced data."),
bl(),
subHead("2.4. Deployable Three-Tier Web Application"),
bl(),
body("Unlike the majority of studies reviewed in the literature — which conclude at model training and evaluation without producing a deployable tool — this research delivers a functioning three-tier web application that operationalises the research findings into a practical system accessible to real users. The application's three-tier architecture (FastAPI backend, Streamlit frontend, PostgreSQL database), role-based access control, JWT authentication, bilingual English and French interface, What-If simulation capability, prediction history tracking, batch class prediction for instructors, and PDF and CSV export functionality collectively represent an engineering contribution that goes substantially beyond the scope of typical undergraduate final year projects and all reviewed related works in the educational data mining domain. The system is deployable locally and publicly via Streamlit Community Cloud, making it accessible to Cameroonian students and academic advisors without requiring institutional IT infrastructure."),
bl(),

// ── 3. RECOMMENDATIONS ──────────────────────────────────────
secHead("3. Recommendations"),
bl(),
body("Based on the findings and outcomes of this research, the following recommendations are proposed for students, academic institutions, instructors, and policymakers."),
bl(),
body("For students, the findings confirm that daily study hours and the management of exam anxiety are the two most powerful determinants of academic performance within a student's direct control. Students are strongly advised to maintain a minimum of five to six structured study hours per day, attend all available tutoring and group study sessions, and actively seek support for exam anxiety through past question practice, study groups, and academic counselling where available. The What-If simulator within the developed application provides an accessible tool for students to explore how incremental improvements in these specific factors can shift their predicted academic outcome."),
bl(),
body("For academic institutions and departments, the results highlight the importance of investing in early-warning systems that identify at-risk students before end-of-semester examinations. The student performance prediction system developed in this research provides a practical starting point for such a system. Academic advisors are encouraged to integrate predictive tools into the first weeks of each semester to identify students showing high stress, low study hours, or poor attendance before these factors compound into academic failure."),
bl(),
body("For instructors, the batch prediction capability of the application enables class-level risk assessment at the beginning of a semester. Instructors are recommended to use this capability to identify students predicted to perform below the average threshold and to initiate targeted support activities — including additional tutorial sessions, study group formation, and direct outreach — for these students before mid-semester assessments."),
bl(),
body("For institutional policymakers and the University of Buea administration, the feature importance findings provide data-driven evidence that structural and infrastructural factors — including electricity availability, home internet access, and home study environment — have a measurable and quantifiable impact on student academic performance. Policy interventions that address these structural barriers, such as extended library and study hall operating hours, subsidised data access for students, and campus-wide backup power infrastructure, are likely to yield broad and sustained improvements in student academic outcomes."),
bl(),
body("For future researchers in the field of educational data mining in Cameroon, this study recommends the collection of primary data directly from Cameroonian university students through structured surveys, as the use of a synthetic dataset — while methodologically valid — introduces inherent limitations on the ecological validity of the model's predictions. A dataset of even 500 to 1,000 real student records collected directly from the University of Buea would substantially increase the model's credibility and deployability as an institutional tool."),
bl(),

// ── 4. DIFFICULTIES ENCOUNTERED ─────────────────────────────
secHead("4. Difficulties Encountered"),
bl(),
body("The realisation of this project was accompanied by several significant challenges that required adaptations to the original research plan and informed the delimitations documented in Chapter One."),
bl(),
mixed([{ text: "Absence of a Cameroonian University Dataset: ", bold: true }, { text: "The most fundamental challenge encountered in this research was the complete absence of a publicly available dataset representing real Cameroonian university students. A comprehensive search of major data repositories including Kaggle, the UCI Machine Learning Repository, and the Harvard Dataverse yielded no dataset capturing the academic performance of students from Cameroonian higher institutions. This necessitated the use of a synthetic dataset as the base data source and the development of the feature engineering methodology as a compensating contribution. While the synthetic dataset provided a clean and well-structured foundation for demonstrating the machine learning pipeline, it introduces limitations on the direct applicability of the trained model to real Cameroonian student populations." }]),
bl(),
mixed([{ text: "XGBoost Installation Failure Due to Bandwidth Constraints: ", bold: true }, { text: "The XGBoost library, which was identified as a candidate algorithm for comparison due to its documented high performance on tabular classification tasks, could not be installed during the course of this research. Repeated attempts to download the installation package (101.7 MB) were interrupted by connection timeouts due to the unstable internet connectivity available during the project period. This prevented the inclusion of XGBoost in the comparative model evaluation and represents a gap in the study that is acknowledged in the Further Works section." }]),
bl(),
mixed([{ text: "PostgreSQL Encoding Error on Windows: ", bold: true }, { text: "The setup of the PostgreSQL database component encountered a persistent UnicodeDecodeError attributed to a UTF-8 encoding incompatibility between the Python environment and the PostgreSQL installation path on the Windows operating system. The error (codec cannot decode byte 0xe9) originated from special characters in the system file path and required environment-level configuration adjustments to resolve. This represented an unexpected technical obstacle in the web application deployment phase." }]),
bl(),
mixed([{ text: "Kernel State Loss in Jupyter Notebook: ", bold: true }, { text: "On multiple occasions during the implementation phase, the Jupyter Notebook kernel was interrupted or restarted, causing all in-memory variables — including the loaded datasets, trained models, and preprocessed feature matrices — to be lost. This required re-execution of all preceding cells before work could resume. This challenge was mitigated by the implementation of a Master Reload Cell that loads the pre-saved engineered CSV datasets directly, bypassing the need to re-execute the entire pipeline from scratch." }]),
bl(),
mixed([{ text: "Limited Project Timeline: ", bold: true }, { text: "The project was completed within a constrained academic timeline of less than one month of active implementation. This time pressure necessitated the prioritisation of core functionality over advanced features — specifically the deferral of email notification for at-risk student intervention, performance goal alert systems, and neural network model comparison to the Further Works category. Under a longer timeline, these features would have strengthened both the practical utility and the comparative evaluation of the system." }]),
bl(),
mixed([{ text: "No Prior Machine Learning Experience: ", bold: true }, { text: "At the commencement of this project, the developer had no prior experience with machine learning algorithms, data science libraries, or web application development frameworks. The entire technical skill set required for the project — including Python data science, scikit-learn, SMOTE, FastAPI, SQLAlchemy, JWT authentication, and ReportLab — was acquired during the project period. While this represents a significant personal learning achievement, it also constrained the pace of implementation and the depth of exploration that was possible within the available time." }]),
bl(),

// ── 5. FURTHER WORKS ────────────────────────────────────────
secHead("5. Further Works"),
bl(),
body("The following directions for future research and development are identified based on the limitations of this study and the potential for extending its contributions."),
bl(),
subHead("5.1. Primary Data Collection from Cameroonian Students"),
bl(),
body("The most impactful improvement to this research would be the collection of primary survey data directly from students at the University of Buea and other Cameroonian higher institutions. A dataset of 500 or more real student records, capturing actual academic performance alongside the lifestyle, socioeconomic, and environmental factors identified in this study, would substantially increase the ecological validity of the predictive model. Future work should develop a validated survey instrument aligned with the 29 features used by the current model and distribute it through departmental channels at the commencement of each academic semester."),
bl(),
subHead("5.2. XGBoost and Gradient Boosting Algorithms"),
bl(),
body("The XGBoost and LightGBM gradient boosting algorithms, which are widely recognised as state-of-the-art performers on tabular classification tasks and which could not be evaluated in this study due to installation constraints, should be incorporated in future comparative evaluations. Gradient boosting methods build trees sequentially, with each tree correcting the errors of the previous one, and have consistently outperformed Random Forest on imbalanced classification problems in published literature. Their inclusion would provide a more comprehensive algorithm comparison and potentially improve the Fail class detection capability of the system."),
bl(),
subHead("5.3. Deep Learning and Neural Network Models"),
bl(),
body("The application of Multi-layer Perceptron neural networks and other deep learning architectures to this classification task should be explored in future work, particularly if a larger primary dataset becomes available. Neural networks are capable of learning complex non-linear feature interactions that linear and tree-based models cannot capture, and may demonstrate superior performance on datasets with a richer set of contextual features. The current dataset size of 8,000 records is at the lower boundary of what is typically recommended for effective neural network training on tabular data."),
bl(),
subHead("5.4. Email and SMS Early Intervention Notification System"),
bl(),
body("The Software Requirements Specification defined in this study included the requirement for an early intervention trigger mechanism (FR-3.3) that would enable academic instructors to send direct alert notifications to students identified as being at risk of academic failure. This requirement was deferred to further works in the Version 1 prototype due to the need for external service integration. Future development should implement this feature using an email notification service such as SendGrid or a local SMS gateway, enabling automated alerts to be dispatched to at-risk students at the beginning of each semester following batch prediction by their instructor."),
bl(),
subHead("5.5. Real-Time Dynamic Feature Integration"),
bl(),
body("The current system operates as a static early-warning screener — it accepts a single snapshot of student characteristics at one point in time and produces a single prediction. Future work should extend the system to support dynamic performance monitoring throughout the academic semester, integrating real-time data inputs such as continuous assessment scores, library usage records, and learning management system activity data as they become available. This would enable the model to update its predictions at multiple points during the semester, providing progressively refined early warnings as the student's academic trajectory becomes clearer."),
bl(),
subHead("5.6. Mobile Application Development"),
bl(),
body("The current web application is designed for desktop browser access. Given that the majority of Cameroonian university students access digital services primarily through mobile devices, the development of a dedicated mobile application — using frameworks such as Flutter or React Native — would substantially increase the accessibility and adoption of the system. A mobile version should support offline prediction capability, storing the model locally on the device to ensure functionality during periods of poor internet connectivity."),
bl(),
subHead("5.7. PostgreSQL to Cloud Database Migration"),
bl(),
body("The current system uses a locally hosted PostgreSQL database, which limits multi-user scalability. Future deployment should migrate the database to a cloud-hosted PostgreSQL instance — such as Amazon RDS, Supabase, or Heroku Postgres — enabling multiple simultaneous users to access the system from different locations without infrastructure limitations. This migration would also facilitate the deployment of the complete three-tier application to a public cloud environment, making it accessible as a genuine institutional tool rather than a local prototype."),
bl(),
subHead("5.8. Model Retraining Pipeline"),
bl(),
body("As primary student data becomes available through future survey collection efforts, a model retraining pipeline should be developed to periodically update the trained model with new data. This pipeline should include automated data validation, feature engineering, preprocessing, model training, evaluation, and deployment steps, enabling the system to improve its predictive accuracy over time as the volume of real Cameroonian student records grows. Continuous model monitoring should also be implemented to detect and alert on model performance drift as the student population's characteristics evolve."),
bl(),

pb(),

// ════════════════════════════════════════════════════════════
// REFERENCES
// ════════════════════════════════════════════════════════════
chHead("REFERENCES"),
bl(),

refEntry("Amrieh, E. A., Hamtini, T., & Aljarah, I. (2016). Mining educational data to predict student's academic performance using ensemble methods. International Journal of Database Theory and Application, 9(8), 119–136. https://doi.org/10.14257/ijdta.2016.9.8.13"),
bl(),
refEntry("Baker, R. S., & Inventado, P. S. (2014). Educational data mining and learning analytics. In J. A. Larusson & B. White (Eds.), Learning Analytics: From Research to Practice (pp. 61–75). Springer. https://doi.org/10.1007/978-1-4614-3305-7_4"),
bl(),
refEntry("Breiman, L. (2001). Random forests. Machine Learning, 45(1), 5–32. https://doi.org/10.1023/A:1010933404324"),
bl(),
refEntry("Chapman, P., Clinton, J., Kerber, R., Khabaza, T., Reinartz, T., Shearer, C., & Wirth, R. (2000). CRISP-DM 1.0: Step-by-step data mining guide. SPSS Inc."),
bl(),
refEntry("Chawla, N. V., Bowyer, K. W., Hall, L. O., & Kegelmeyer, W. P. (2002). SMOTE: Synthetic minority over-sampling technique. Journal of Artificial Intelligence Research, 16, 321–357. https://doi.org/10.1613/jair.953"),
bl(),
refEntry("Cortez, P., & Silva, A. (2008). Using data mining to predict secondary school student performance. In A. Brito & J. Teixeira (Eds.), Proceedings of 5th Annual Future Business Technology Conference (pp. 5–12). EUROSIS."),
bl(),
refEntry("Delen, D. (2010). A comparative analysis of machine learning techniques for student retention management. Decision Support Systems, 49(4), 498–506. https://doi.org/10.1016/j.dss.2010.06.003"),
bl(),
refEntry("Hanushek, E. A. (2011). The economic value of higher teacher quality. Economics of Education Review, 30(3), 466–479. https://doi.org/10.1016/j.econedurev.2010.12.006"),
bl(),
refEntry("Hashim, A. S., Awadh, W. A., & Hamoud, A. K. (2020). Student performance prediction model based on supervised machine learning algorithms. IOP Conference Series: Materials Science and Engineering, 928(3), 032019. https://doi.org/10.1088/1757-899X/928/3/032019"),
bl(),
refEntry("Hosmer, D. W., & Lemeshow, S. (2000). Applied Logistic Regression (2nd ed.). John Wiley & Sons. https://doi.org/10.1002/0471722146"),
bl(),
refEntry("Kotsiantis, S. B. (2012). Use of machine learning techniques for educational proposes: A decision support system for forecasting students' grades. Artificial Intelligence Review, 37(4), 331–344. https://doi.org/10.1007/s10462-011-9234-x"),
bl(),
refEntry("Mduma, N., Kalegele, K., & Machuve, D. (2019). A survey of machine learning approaches and techniques for student dropout prediction. The Data Science Journal, 18(1), 1–11. https://doi.org/10.5334/dsj-2019-014"),
bl(),
refEntry("Mitchell, T. M. (1997). Machine Learning. McGraw-Hill."),
bl(),
refEntry("Musso, M. F., Hernandez, C. F. R., & Cascallar, E. C. (2020). Predicting key educational outcomes in academic trajectories: A machine-learning approach. Higher Education, 80(5), 875–894. https://doi.org/10.1007/s10734-020-00520-7"),
bl(),
refEntry("Pedregosa, F., Varoquaux, G., Gramfort, A., Michel, V., Thirion, B., Grisel, O., Blondel, M., Prettenhofer, P., Weiss, R., Dubourg, V., Vanderplas, J., Passos, A., Cournapeau, D., Brucher, M., Perrot, M., & Duchesnay, E. (2011). Scikit-learn: Machine learning in Python. Journal of Machine Learning Research, 12, 2825–2830."),
bl(),
refEntry("Quinlan, J. R. (1986). Induction of decision trees. Machine Learning, 1(1), 81–106. https://doi.org/10.1007/BF00116251"),
bl(),
refEntry("Romero, C., & Ventura, S. (2010). Educational data mining: A review of the state of the art. IEEE Transactions on Systems, Man, and Cybernetics, Part C (Applications and Reviews), 40(6), 601–618. https://doi.org/10.1109/TSMCC.2010.2053532"),
bl(),
refEntry("Romero, C., Espejo, P. G., Zafra, A., Romero, J. R., & Ventura, S. (2013). Web usage mining for predicting final marks of students that use Moodle courses. Computer Applications in Engineering Education, 21(1), 135–146. https://doi.org/10.1002/cae.20456"),
bl(),
refEntry("Tchamyou, V. S. (2020). Education, lifelong learning, inequality and financial access: Evidence from African countries. Contemporary Social Science, 15(1), 7–25. https://doi.org/10.1080/21582041.2018.1433314"),
bl(),
refEntry("Tinto, V. (1987). Leaving College: Rethinking the Causes and Cures of Student Attrition. University of Chicago Press."),
bl(),
refEntry("Tukey, J. W. (1977). Exploratory Data Analysis. Addison-Wesley."),
bl(),
refEntry("World Bank. (2021). Tertiary education overview: Sub-Saharan Africa. The World Bank Group. https://www.worldbank.org/en/topic/tertiaryeducation"),
bl(),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('C:\\Users\\PC\\Documents\\Student_performance\\student_performance\\report\\Chapter5_Conclusion_and_References.docx', buf);
  console.log('Chapter 5 and References generated successfully!');
});