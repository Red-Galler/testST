// surveysSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';
import { useDispatch } from 'react-redux';



export const fetchSurveyData = createAsyncThunk(
  'surveys/fetchSurveyData',
  async (id) => {

    try {

      const surveyResponse = await supabase.from('Surveys2').select('*').eq('id', id).single();
      const sectionsResponse = await supabase.from('Sections2').select('*').eq('surveyId', id).order('sectionOrder', { ascending: true });
      const allQuestionKindsResponse = await supabase.from('QuestionKinds2').select('*')


      if (sectionsResponse.data.length > 0) {

        sectionsResponse.data = sectionsResponse.data.map(section => ({ ...section, type: 'section' }))
      }



      return {
        survey: surveyResponse.data,
        sections: sectionsResponse.data,
        allQuestionKinds: allQuestionKindsResponse.data,
      };

    }
    catch (error) {
      console.log(error);
    }

  }
);

export const fetchLogo = createAsyncThunk(
  'surveys/fetchLogo',
  async (logoName) => {

    let logo = null;

    if (logoName) {
      const { data, error } = await supabase.storage.from('survey_logos').download(logoName)

      console.log('fff')
      if (error) throw error;
      logo = URL.createObjectURL(data);

      console.log(logo)

    }

    return logo;
  }
)

export const fetchSurveyStyle = createAsyncThunk(
  'surveys/fetchSurveyStyle',
  async (surveyId) => {

    let surveyStyle = null

    console.log(surveyId)


    if (surveyId) {
      const { data, error } = await supabase.from('SurveyStyles2').select('*').eq('surveyId', surveyId).single();
      if (data) { surveyStyle = data }
    }

    return surveyStyle;
  }
)


const surveySlice = createSlice({
  name: 'surveys',
  initialState: {
    survey: null,
    logo: null,
    surveyStyles: null,
    sections: [],
    status: 'idle',
    error: null,
    active: null,
    allQuestionKinds: []
  },
  reducers: {
    changeActive: (state, action) => {
      state.active = action.payload;
    },
    updateSectionsList: (state, action) => {

      // We need this type to determine if the active block is a section or a question
      action.payload.type = 'section'

      state.sections.push(action.payload);

      // Then we search the new added section, and set it as the active block
      const newActiveSection = state.sections.find(section => section.id === action.payload.id);
      state.active = newActiveSection;
    },
    updateSurveyStyles: (state, action) => {

      state.surveyStyles = action.payload;
    },

    updateLogo: (state, action) => {
      state.logo = action.payload;
    },
  },



  extraReducers: builder => {
    builder
      .addCase(fetchSurveyData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSurveyData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.survey = action.payload.survey;
        state.sections = action.payload.sections;
        state.sectionsCount = action.payload.sectionsCount;
        state.allQuestionKinds = action.payload.allQuestionKinds;

      })
      .addCase(fetchSurveyData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(fetchLogo.fulfilled, (state, action) => {
        state.logo = action.payload;
      })
      
      .addCase(fetchSurveyStyle.fulfilled, (state, action) => {
        state.surveyStyles = action.payload;
      })
  }
});

export default surveySlice.reducer;
export const { changeActive, updateSectionsList, updateSurveyStyles, updateLogo } = surveySlice.actions;

