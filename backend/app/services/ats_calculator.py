import re
import math
from typing import List, Dict, Any, Tuple
from app.services.resume_parser import SKILL_DICTIONARY

# Standard English Stop Words to keep tokenizing signals high other than grammatical noise
STOP_WORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", 
    "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", 
    "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", 
    "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", 
    "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", 
    "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", 
    "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", 
    "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", 
    "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", 
    "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", 
    "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", 
    "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", 
    "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", 
    "you're", "you've", "your", "yours", "yourself", "yourselves"
}

class ATSCalculatorService:
    @staticmethod
    def tokenize(text: str) -> List[str]:
        """
        Splits text into lowercased tokens, strips punctuation except special tech chars (+, #, .), 
        and excludes common stopwords.
        """
        # Convert to lower and replace special typographic characters safely
        text = text.lower()
        # Segment keeping characters like C++ or .js intact
        raw_tokens = re.findall(r"\b[a-z0-9+#\.]+\b", text)
        
        # Strip trailing dots from general words but keep for file suffixes or .js
        processed_tokens = []
        for t in raw_tokens:
            if t.endswith(".") and not t.endswith(".js"):
                t = t.rstrip(".")
            if t and t not in STOP_WORDS:
                processed_tokens.append(t)
        return processed_tokens

    @staticmethod
    def calculate_tfidf_vectors(doc1: str, doc2: str) -> Tuple[Dict[str, float], Dict[str, float]]:
        """
        Builds raw TF-IDF weights vectors for two documents (the Resume and the Job Description).
        Returns two dictionaries mapping word strings to their respective TF-IDF weights.
        """
        tokens1 = ATSCalculatorService.tokenize(doc1)
        tokens2 = ATSCalculatorService.tokenize(doc2)

        # 1. Calculate Term Frequencies (TF)
        tf1: Dict[str, float] = {}
        tf2: Dict[str, float] = {}
        
        for t in tokens1:
            tf1[t] = tf1.get(t, 0) + 1
        for t in tokens2:
            tf2[t] = tf2.get(t, 0) + 1

        # Normalize Term Frequency relative to length of document to maintain ratio parity
        total_tokens1 = len(tokens1) or 1
        total_tokens2 = len(tokens2) or 1
        
        for t in tf1:
            tf1[t] = tf1[t] / total_tokens1
        for t in tf2:
            tf2[t] = tf2[t] / total_tokens2

        # 2. Compute Inverse Document Frequencies (IDF)
        # N = 2. document frequency (df) can be 1 or 2
        all_unique_terms = set(list(tf1.keys()) + list(tf2.keys()))
        idf: Dict[str, float] = {}
        
        for term in all_unique_terms:
            df = 0
            if term in tf1:
                df += 1
            if term in tf2:
                df += 1
            # idf equation with standard smoothing
            idf[term] = math.log(1.0 + (2.0 / df)) + 1.0

        # 3. Calculate TF-IDF vectors
        vector1: Dict[str, float] = {t: tf1[t] * idf[t] for t in tf1}
        vector2: Dict[str, float] = {t: tf2[t] * idf[t] for t in tf2}

        return vector1, vector2

    @staticmethod
    def cosine_similarity(vector1: Dict[str, float], vector2: Dict[str, float]) -> float:
        """
        Computes cosine similarity between two dimensional TF-IDF vector representations.
        Cosine similarity = (A . B) / (||A|| * ||B||)
        """
        all_key_terms = set(list(vector1.keys()) + list(vector2.keys()))
        
        dot_product = 0.0
        for term in all_key_terms:
            dot_product += vector1.get(term, 0.0) * vector2.get(term, 0.0)

        magnitude1 = math.sqrt(sum(val ** 2 for val in vector1.values()))
        magnitude2 = math.sqrt(sum(val ** 2 for val in vector2.values()))

        if not magnitude1 or not magnitude2:
            return 0.0

        similarity = dot_product / (magnitude1 * magnitude2)
        return min(max(similarity, 0.0), 1.0) # Clip between [0, 1] bounds safely

    @classmethod
    def analyze_ats_score(cls, resume_text: str, job_description: str, resume_skills: List[str]) -> Dict[str, Any]:
        """
        Performs overall high-fidelity parsing checks:
          - Calculates TF-IDF text similarity
          - Matches skill catalogs to find gaps
          - Builds keyword frequencies reports
          - Generates placement tips/improvements suggestions
        """
        # calculate core vector similarity
        vec1, vec2 = cls.calculate_tfidf_vectors(resume_text, job_description)
        similarity = cls.cosine_similarity(vec1, vec2)

        # Extract keywords mentioned inside the job description that correspond to our skill catalogs
        job_skills = set()
        job_desc_lower = job_description.lower()
        
        for category, list_of_skills in SKILL_DICTIONARY.items():
            for skill in list_of_skills:
                # Direct word boundary check, sensitive to special tech terminologies like C++ or Node.js
                pattern = rf"\b{skill}\b" if not skill.endswith(("+", ".")) else rf"\b{skill}"
                if re.search(pattern, job_desc_lower, re.IGNORECASE):
                    formatted_skill = skill.replace("\\", "")
                    job_skills.add(formatted_skill)

        # Contrast with candidate's actual extracted skills
        resume_skills_set = {s.lower() for s in resume_skills}
        matched_skills = []
        missing_skills = []

        for skill in job_skills:
            if skill.lower() in resume_skills_set:
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)

        # Sort values
        matched_skills.sort()
        missing_skills.sort()

        # Keyword frequency report from tf metrics (select high score tokens)
        joint_frequencies = []
        token_freq_resume = {}
        token_freq_job = {}

        # Capture raw frequencies
        for word in cls.tokenize(resume_text):
            token_freq_resume[word] = token_freq_resume.get(word, 0) + 1
        for word in cls.tokenize(job_description):
            token_freq_job[word] = token_freq_job.get(word, 0) + 1

        # Combine high frequency terms mentioned on both ends or high value in general
        salient_terms = sorted(
            list(set(list(token_freq_resume.keys()) + list(token_freq_job.keys()))),
            key=lambda w: max(token_freq_resume.get(w, 0), token_freq_job.get(w, 0)),
            reverse=True
        )

        for term in salient_terms[:12]: # Deliver top 12 salient terms
            joint_frequencies.append({
                "keyword": term,
                "resume_frequency": token_freq_resume.get(term, 0),
                "job_frequency": token_freq_job.get(term, 0)
            })

        # Calculate an weighted composite score representing actual placement assessment criteria
        # 40% goes to raw TF-IDF Cosine Similarity
        # 40% goes to Core Tech Skill match index
        # 20% goes to experience keywords density
        skill_match_ratio = len(matched_skills) / len(job_skills) if job_skills else 1.0
        
        # Compute baseline weighted score
        weighted_score = (similarity * 40.0) + (skill_match_ratio * 40.0) + (min(len(resume_skills) * 4.0, 20.0))
        # Ensure it fits elegantly in percentage guidelines 0-100%
        final_percentage = min(max(weighted_score, 15.0), 100.0)

        # Generate custom resume booster tips
        improvements = []
        if final_percentage < 55.0:
            improvements.append("Critical Alignment: Your resume text similarity is too remote from the core job requirements. Revise headers and bullet outlines entirely.")
        
        if missing_skills:
            top_missing = missing_skills[:3]
            missing_text = ", ".join(f"'{s}'" for s in top_missing)
            improvements.append(f"Add Skills Target: Integrate missing technology keywords {missing_text} prominently in your technical outline.")
        else:
            if not job_skills:
                improvements.append("Notice: The job description doesn't catalog distinct technical keywords. Add structural parameters for a clearer match.")
            else:
                improvements.append("Outstanding Stack: All critical technical skills listed in the job description are mirrored in your portfolio credentials!")

        if len(resume_skills) < 5:
            improvements.append("Expand Resume Repository: List at least 5 distinct programming languages, databases, or cloud modules to boost keyword index coverage.")

        if "project" not in token_freq_resume:
            improvements.append("Incorporate Projects: Add a distinct academic projects header or list active GitHub URLs representing microservices.")

        if final_percentage > 85.0:
            improvements.append("Placement Readiness: Excellent resume indexing. Proceed to draft specialized target portfolio links for final employer selection!")
        else:
            improvements.append("Quantify Actions: Start bullet points with dynamic verbs ('Implemented', 'Spearheaded', 'Optimized') and metrics ('Reduced latency by 40%').")

        return {
            "score": round(final_percentage, 1),
            "match_percentage": round(final_percentage, 1),
            "skill_gap": {
                "matched_skills": matched_skills,
                "missing_skills": missing_skills
            },
            "keyword_frequencies": joint_frequencies,
            "suggested_improvements": improvements
        }
