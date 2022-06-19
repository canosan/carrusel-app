import { View, Text, ToastAndroid } from 'react-native'
import React, { useContext, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import GlobalContext from '../context/Context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageView from "react-native-image-viewing";
import Avatar from '../components/Avatar';
import { Col, Row } from 'react-native-easy-grid';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';

export default function InfoUsuario() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageView, setSeletedImageView] = useState("");
    const { theme: { colors, perfil } } = useContext(GlobalContext);
    const route = useRoute();
    const user = route.params.user;
    return (
        <View
          style={ perfil }
        >
        
        <Row
          style={{
            maxHeight: 100,
          }}
        >
          <Col
            style={{
                width: "40%",
                justifyContent: "center",
                alignItems: "center"
            }}
          >
            <TouchableOpacity
                style={{
                    borderRadius: 120,
                    width: 120,
                    height: 120,
                }}
                onPress={() => {
                    if(user.photoURL){
                        setModalVisible(true);
                        setSeletedImageView(user.photoURL);
                    }
                    else ToastAndroid.show("Sin foto de perfil", 50)
                }}
            >
                <Avatar user={user} size={120} />
                {selectedImageView ? (
                <ImageView
                    imageIndex={0}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                    images={[{ uri: selectedImageView }]}
                />
                ) : (null)}
            </TouchableOpacity>
          </Col>

          <Col
            style={{
                justifyContent: "center"
            }}
          >

            <Text
              style={{
                width: "100%",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >{user.nombreContacto || user.displayName}</Text>
            
            <Text
              style={{
                width: "100%",
                color: colors.lightGray
              }}
            >~{user.displayName}</Text>

            {user.email ? (
              <TouchableOpacity
                onPress={() => {
                  if(Clipboard.setString(user.email)){
                    ToastAndroid.show("Copiado al portapapeles", 50)
                  }
                }}
              >
                <Text
                  style={{
                    marginTop: 5,
                    width: "100%",
                  }}
                >{user.email} <MaterialCommunityIcons name='content-copy' /></Text>
              </TouchableOpacity>
            ) : (null)}
            
          </Col>
        </Row>

        <Row></Row>

      </View>
        
    )
}