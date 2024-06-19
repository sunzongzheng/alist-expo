import Toast from "react-native-root-toast";
import {useScale} from "@/hooks/useScale";

export default function useToast() {
  const scale = useScale()

  return (msg: string) => {
    Toast.show(msg, {
      position: Toast.positions.CENTER,
      containerStyle: {
        paddingHorizontal: 24 * scale,
        paddingVertical: 12 * scale,
      },
      textStyle: {
        fontSize: 16 * scale
      },
    })
  }
}
