import React from "react"
import { Text as RNText } from 'react-native-paper';

type RNPTextInputProps = React.ComponentProps<typeof RNText>;

const Paragraph: React.FC<RNPTextInputProps> = ({ children, ...props }) => {
    return <RNText
        variant="bodyMedium"
        style={{
            fontFamily: 'regular'
        }}
        {...props}
    >
        {children}
    </RNText>
}

export default Paragraph;