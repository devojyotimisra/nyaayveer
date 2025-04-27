import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
} from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import Icon from "react-native-vector-icons/MaterialIcons";

import { fetchMessages } from "../service/backend";
import { Message } from '../components/ChatUtils';

import { useAppContext } from "../AppContext";
import { FlatList } from "react-native-gesture-handler";
import { Image } from "@rneui/themed";

import Loading from "./Loading";

interface ItemModalProps {
    visible: boolean;
    onClose: () => void;
    itemName: string;
    userToken: string|null;
}

const audioRecorderPlayer = new AudioRecorderPlayer();

const ItemModal: React.FC<ItemModalProps> = ({ visible, onClose, itemName, userToken }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { userData } = useAppContext();

    const caseNo = itemName.split(":")[0];

    useEffect(() => {
        if (visible) {
            console.log(userData?.unique_id, caseNo);
            getMessages();
        }
    }, [visible]);

    if (!messages) {
        return (
            <Modal transparent visible={visible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Icon name="close" size={25} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <ImageBackground
                            source={require('../../assets/logo.png')}
                            style={styles.logo}
                        />
                        <Loading />
                    </View>
                </View>
            </Modal>
        )
    }

    const getMessages = async () => {
        console.log(userData?.unique_id, caseNo);
        const response = await fetchMessages(userData?.unique_id, caseNo, userToken);
        setMessages(response);
        setIsLoading(false);
    }

    const handleImagePress = (uri: string) => {
        setSelectedImage(uri);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    // Helper function to render text content based on whether it's a string or array
    const renderTextContent = (textContent: any) => {
        if (typeof textContent === 'string') {
            return <Text style={styles.messageText}>{textContent}</Text>;
        } else if (Array.isArray(textContent)) {
            return (
                <View style={styles.arrayContainer}>
                    {textContent.map((item, index) => (
                        <View key={index} style={styles.arrayItem}>
                            {Object.entries(item).map(([key, value]) => (
                                <Text key={key} style={styles.arrayText}>
                                    <Text style={styles.arrayKey}>{key}:</Text> {String(value)}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>
            );
        } else if (typeof textContent === 'object' && textContent !== null) {
            return (
                <View style={styles.objectContainer}>
                    {Object.entries(textContent).map(([key, value]) => (
                        <Text key={key} style={styles.objectText}>
                            <Text style={styles.objectKey}>{key}:</Text> {value !== null && value !== undefined ? String(value) : ''}
                        </Text>
                    ))}
                </View>
            );
        }
        return <Text style={styles.messageText}>Unsupported content format</Text>;
    };

    const renderItem = ({ item }: { item: Message }) => (
        <View
            style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userBubble : styles.botBubble,
            ]}>
            {item.type === 'text' && renderTextContent(item.text)}
            {item.type === 'image' && (
                <TouchableOpacity onPress={() => handleImagePress(item.uri)}>
                    <Image 
                        source={{ uri: item.uri }} 
                        style={styles.mediaImage} 
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            )}
            {item.type === 'audio' && (
                <TouchableOpacity
                    onPress={() => audioRecorderPlayer.startPlayer(item.uri)}>
                    <Icon name="play-circle" size={30} color="black" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => {
                            setMessages([]);
                            onClose();
                        }}>
                            <Icon name="close" size={25} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <ImageBackground
                        source={require('../../assets/logo.png')}
                        style={styles.logo}
                    />
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <FlatList
                            data={messages}
                            keyExtractor={item => item.id.toString()}
                            renderItem={item => renderItem(item)}
                            style={styles.messageList}
                            contentContainerStyle={styles.chatContainer}
                        />
                    )}
                    
                    {/* Image Modal - Fixed implementation */}
                    {selectedImage && (
                        <Modal visible={true} transparent={true} animationType="fade">
                            <View style={styles.modalContainer}>
                                <TouchableOpacity
                                    style={styles.closeButtonImage}
                                    onPress={closeImageModal}>
                                    <Icon name="close" size={30} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.imageTitle}>Unable to load image</Text>
                                {selectedImage && (
                                    <Image
                                        source={{ uri: selectedImage }}
                                        style={styles.fullImage}
                                        resizeMode="contain"
                                        onError={(e) => console.error("Image load error:", e.nativeEvent.error)}
                                    />
                                )}
                            </View>
                        </Modal>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        width: "95%",
        height: "95%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 5,
        alignItems: "center",
        elevation: 5,
    },
    header: {
        width: "100%",
        height: '3%',
        flexDirection: "row",
    },
    closeButton: {
        top: 5,
        right: 7,
        position: "absolute",
        marginTop: 0,
        fontSize: 20,
    },
    logo: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
        opacity: 30,
        marginTop: '40%',
        marginBottom: '50%',
        position: 'absolute',
        elevation: -1,
    },
    messageBubble: {
        padding: 12,
        marginVertical: 4,
        borderRadius: 10,
        maxWidth: '80%',
    },
    userBubble: {
        backgroundColor: '#FFD700',
        alignSelf: 'flex-end',
    },
    botBubble: {
        backgroundColor: '#E0E0E0',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: '#000',
    },
    messageList: {
        elevation: 5,
        width: '90%',
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    mediaImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonImage: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    fullImage: {
        width: '90%',
        height: '70%',
        resizeMode: 'contain',
    },
    imageTitle: {
        color: '#fff',
        marginBottom: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
    // New styles for array rendering
    arrayContainer: {
        width: '100%',
    },
    arrayItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 5,
        padding: 8,
        marginBottom: 8,
    },
    arrayText: {
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
    },
    arrayKey: {
        fontWeight: 'bold',
    },
    // For object rendering
    objectContainer: {
        width: '100%',
    },
    objectText: {
        fontSize: 14,
        marginBottom: 4,
    },
    objectKey: {
        fontWeight: 'bold',
    },
});

export default ItemModal;