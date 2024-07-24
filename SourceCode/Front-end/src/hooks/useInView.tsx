
import React, {useState, useEffect, useRef} from "react";

const useInView = () => {

    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(()=> {
        const rf = ref.current;
        const observer = new IntersectionObserver((entries) => {
            setIsInView(entries[0].isIntersecting) 

        })

        if(rf) observer.observe(rf)

        return ()=> {
            if(rf) observer.unobserve(rf)

        }
    })



    return {isInView, ref}
}

export default useInView