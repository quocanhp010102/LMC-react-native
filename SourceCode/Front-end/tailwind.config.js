module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            animation: {
                animate_pulse_custom: 'pulse 1s cubic-bezier(0.25, 0.5, 0.75, 1) infinite',
            },
            gridAutoRows: {
                '5fr': 'minmax(20px, 5fr)',
            },
            colors: {
                primary: '#CC0000',
                text_pri: '#D70000',
                text_com: '#7D7D7D',
                bg61: '#610000',
                color63: '#636363',
                color37: '#373737',
                color32: '#32813D',
                borderColor: '#D0D0D0',
                light_blue: '#0472BC',
                text_light_blue: '#00A8B5',
                blue_bg: '#0D2A5A',
                primary_blue: '#014F59',
                colorC4: "C4C4C4",
                light_gray: '#014F597f',
                btn_bg: "rgba(99, 99, 99, 0.1)",
                sub_text_color: "rgba(0, 59, 114, 0.5)"
            },
        },
        screens: {
            sx: '330px',
            sm: '640px',
            // => @media (min-width: 640px) { ... }

            md: '1024px',
            // => @media (min-width: 1024px) { ... }

            lg: '1280px',
            sc1536: { min: '1536px', max: '1919px' },
            sc1366: { min: '1366px', max: '1535px' },
            sc1920: '1920px',
            // => @media (min-width: 1280px) { ... }
        },
    },
}
