import { Box } from "native-base";

export default function SettingsBoxContainer({ children, ...props}) {
  return (
    <Box 
      width="100%" 
      rounded={20} 
      px="5" 
      py="2" 
      bg="white" 
      style={{
        shadowColor: 'black',
        shadowRadius: 15,
        shadowOpacity: 0.1
      }}
      {...props}
    >
      {children}
    </Box>
  )
}