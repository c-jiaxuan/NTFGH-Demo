export const llm_config = {
    bot_app: "sgroots", // Don't change this
    bot_tone: "Succinct", // Professional, Casual, Enthusiastic, Informational, Funny, Succinct
    bot_format: "Summary", // Summary, Report, Bullet Points, LinkedIn Post, Email
    bot_language: "English",
    bot_followup: true,

    // API Endpoints from Gramaner
    llm_summarise_api_url: 'https://gramener.com/docsearch/summarize',
    llm_similarity_api_url: 'https://gramener.com/docsearch/similarity',
    llm_extract_api_url: 'https://llmentityextractor.sanand.workers.dev/extract',
    llm_classify_api_url: 'https://voicewebapp.straivedemo.com/classify',

    maxSelected: 10 // Max selected similar documents, used in similarity call;
}
