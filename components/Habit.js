import { View, Text } from "react-native"
import {Box, Button, Flex, IconButton} from 'native-base'
import Icon  from "react-native-vector-icons/EvilIcons"
import { useState } from "react"
const Habit = (props) => {
    const [days,setDays] = useState(props.habit.days)
    const dayText = {Monday:"M",Tuesday:"T",Wednesday:"W",Thursday:"Th",Friday:"F",Saturday:"S",Sunday:"Su"}
    const handleClick = (day) => {
        let cur = days[day]
        days[day] = cur == "Default" ? "Complete" : "Default"
        setDays({
            ...days
        })
    }
    const reset = () =>{
        props.setDays(props.title)
        setDays({
            Monday:"Default",
            Tuesday:"Default",
            Wednesday:"Default",
            Thursday:"Default",
            Friday:"Default",
            Saturday:"Default",
            Sunday:"Default",
        })
    }
    return(
        <View>
            <Box rounded={"lg"}>
            <Flex direction="row" w={"100%"}>
                <Text style={{paddingLeft:20,fontSize:20}}>{props.habit.title}</Text>
                <IconButton
                    style={{paddingLeft:50}}
                    right={-200}
                    top={-10}
                    icon={<Icon name="trash" size={30}/>}
                    onPress={() => props.remove(props.title)}
                    />
                <IconButton
                    style={{paddingLeft:100}}
                    right={-130}
                    top={-10}
                    icon={<Icon name="undo" size={30}/>}
                    onPress={() => reset()}
                    />
                </Flex>
                <Flex direction="row" w={"100%"}>
                {Object.keys(days).map((day,i) => {
                    return <Button rounded 
                        borderRadius={100} 
                        variant="outline" 
                        borderColor={"amber.100"} 
                        w={"14%"} h={10} key={i} 
                        onPress={(evt) => handleClick(day)} 
                        background={days[day] == "Default" ? "#6fdc6f" : "#178237"}>{dayText[day]}</Button>
                })}
                </Flex>
            </Box>
        </View>
    )
}

export default Habit