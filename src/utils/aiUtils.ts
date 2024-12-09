import { HfInference } from '@huggingface/inference';

export const analyzeDataWithAI = async (
  data: any[],
  prompt: string,
  token: string = process.env.HUGGINGFACE_API_KEY || ''
): Promise<{
  text: string;
  recommendations: string[];
  suggestedColumns: string[];
}> => {
  try {
    const hf = new HfInference(token);

    const dataSample = data.slice(0, 5);
    const columns = Object.keys(dataSample[0] || {});
    
    const systemPrompt = `Analyze this dataset and provide insights.
      Data columns: ${columns.join(', ')}
      Sample data: ${JSON.stringify(dataSample, null, 2)}
      User request: ${prompt}
      
      Format your response as:
      1. Key Findings
      2. Recommended Visualizations
      3. Suggested Analysis`;

    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: systemPrompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        return_full_text: false
      }
    });

    const analysis = response.generated_text || '';
    
    // Extract chart recommendations
    const chartTypes = ['bar', 'line', 'pie', 'scatter', 'radar'];
    const recommendations = chartTypes.filter(type => 
      analysis.toLowerCase().includes(type)
    );

    // Extract column suggestions
    const suggestedColumns = columns.filter(col =>
      analysis.toLowerCase().includes(col.toLowerCase())
    );

    return {
      text: analysis,
      recommendations: recommendations.length ? recommendations : ['bar'],
      suggestedColumns: suggestedColumns.length ? suggestedColumns : columns.slice(0, 2)
    };
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to analyze data. Please try again.');
  }
};