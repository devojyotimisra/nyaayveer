import axios from 'axios';
import { Message } from '../components/ChatUtils';
import Snackbar from 'react-native-snackbar';
import Config from 'react-native-config';

const Url = `${Config.REACT_APP_BASE_URL}`


const Base_URL = Url;
const API_URL_VERIFY = `${Base_URL}api/auth`;
const API_URL = `${Base_URL}api/data`;
const API_URL_RESPONSE = `${Base_URL}api/`;

export const saveMessages = async (messages: any[], uniqueId: string, victimName: string, caseNumber: string, userToken: string | null) => {
  let d = new Date();
  const dateString = d.toDateString();
  try {
    const data = { "unique_id": uniqueId, "messages": messages, "date": dateString, "name": victimName, "caseNumber": caseNumber };
    await axios.post(`${API_URL}/saveData`, { data }, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
  } catch (error) {
    console.error('Error saving messages:', error);
    throw error;
  }
};

export const fetchMessages = async (uniqueId: string|undefined, caseNumber: string, userToken: string | null) => {
  try {
    const response = await axios.get(`${API_URL}/getData/messages/${uniqueId}/${caseNumber}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    return response.data.messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const fetchCases = async (uniqueId: string|undefined, userToken: string | null) => {
  try {
    const response = await axios.get(`${API_URL}/cases/${uniqueId}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dates:', error);
    throw error;
  }
};

export const fetchResponse = async (message: Message | undefined, id: string|null) => {
  try {
    const type = message?.type;
    const text = message?.text;
    const uri = message?.uri;

    const data = {"text": text, "uri": uri };
    const response = await axios.post(`${API_URL_RESPONSE}${type}`, { data }, {
      headers: {
        'Authorization': `Bearer ${id}`
      }});
    return response.data.output;
  } catch (error) {
    Snackbar.show({
      text: "Network Error",
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#e74c3c',
    })
    console.error('Error fetching response:', error);
    throw error;
  }
}

export const verifyUser = async (uniqueId: string|undefined) => {
  try {
    const response = await axios.get(`${Base_URL}api/data/verify?unique_id=${uniqueId}`);
    return response.data.exists;
  } catch (error) {
    console.error('Error fetching User:', error);
    throw error;
  }
};