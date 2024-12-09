import { HfInference } from '@huggingface/inference';
import { ProcessedFileData } from '../types/fileTypes';
import { calculateDatasetStatistics } from '../utils/statisticsUtils';
import { generateAnalysisPrompt } from '../utils/promptUtils';
import { extractChartRecommendations, extractRelevantColumns } from '../utils/chartUtils';

const DEFAULT_TOKEN = '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';

export interface AnalysisResult {
  text: string;
  recommendations: string[];
  suggestedColumns: string[];
}

export const analyzeData = async (
  datasets: ProcessedFileData[],
  prompt: string,
  token: string = DEFAULT_TOKEN
): Promise<AnalysisResult> => {
  try {
    const hf = new HfInference(token);

    // Combine all datasets and calculate statistics
    const combinedData = datasets.reduce((acc, curr) => [...acc, ...curr.data], []);
    const allColumns = new Set(datasets.flatMap(d => d.columns));
    const statistics = calculateDatasetStatistics(combinedData, Array.from(allColumns));
    
    // Generate analysis prompt
    const systemPrompt = generateAnalysisPrompt({
      datasets,
      statistics,
      userPrompt: prompt
    });

    // Get AI analysis
    const response = await hf.textGeneration({
      model: 'meta-llama/Llama-3.2-3B-Instruct',
      inputs: systemPrompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false
      }
    });

    const analysis = response.generated_text || 'No analysis generated';
    
    // Extract recommendations and columns
    const recommendations = extractChartRecommendations(analysis, statistics.columnStats);
    const suggestedColumns = extractRelevantColumns(analysis, statistics.columnStats);

    return {
      text: analysis,
      recommendations,
      suggestedColumns
    };
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to analyze data: ' + (error.message || 'Unknown error'));
  }
};