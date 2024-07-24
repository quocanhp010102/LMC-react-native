import Svg, {Path} from "react-native-svg";
import {baseColors} from "../../themes";

interface IProps {
    width?: number;
    height?: number;
    color?: string;
    fillText?: boolean
}

const ICLogo = ({
                    width = 224,
                    height = 43,
                    color = baseColors.white,
                    fillText
                }: IProps) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 224 43"
            fill="none"

        >
            <Path d="M35.756 0H0v42.378h35.756V0z" fill="#F4F7FC"/>
            <Path
                d="M5.152 37.94v1.186c0 .134-.029.25-.086.35a.555.555 0 01-.25.225.866.866 0 01-.386.078c-.226 0-.4-.057-.53-.173a.615.615 0 01-.196-.47v-1.193h.443v1.204c.004.198.1.297.28.297.092 0 .16-.025.207-.075.046-.049.071-.13.071-.243v-1.183h.447v-.004zM6.375 39.27a.174.174 0 00-.068-.148.8.8 0 00-.24-.11 2.748 2.748 0 01-.282-.11c-.24-.116-.357-.275-.357-.476a.41.41 0 01.09-.265.577.577 0 01.25-.18.986.986 0 01.364-.064c.132 0 .25.025.354.071a.514.514 0 01.329.49h-.44a.22.22 0 00-.068-.172c-.046-.043-.107-.06-.186-.06a.29.29 0 00-.186.053.165.165 0 00-.067.13c0 .046.025.089.075.128a.9.9 0 00.264.116c.125.039.233.085.311.13.197.114.297.27.297.467 0 .159-.06.282-.182.374-.122.092-.286.134-.497.134a.994.994 0 01-.404-.077.599.599 0 01-.272-.216.563.563 0 01-.093-.318h.443c0 .1.025.17.075.216.05.046.133.07.247.07a.274.274 0 00.172-.045.158.158 0 00.071-.138zM7.992 39.27a.174.174 0 00-.068-.148.8.8 0 00-.24-.11 2.748 2.748 0 01-.282-.11c-.24-.116-.358-.275-.358-.476a.41.41 0 01.09-.265.577.577 0 01.25-.18.986.986 0 01.365-.064c.132 0 .25.025.354.071a.514.514 0 01.329.49h-.44a.22.22 0 00-.068-.172c-.046-.043-.107-.06-.186-.06a.29.29 0 00-.186.053.165.165 0 00-.068.13c0 .046.025.089.075.128a.9.9 0 00.265.116c.125.039.232.085.311.13.197.114.297.27.297.467 0 .159-.061.282-.183.374-.121.092-.286.134-.497.134a.994.994 0 01-.404-.077.599.599 0 01-.271-.216.563.563 0 01-.093-.318h.443c0 .1.025.17.075.216.05.046.132.07.247.07a.274.274 0 00.171-.045.158.158 0 00.072-.138zM10.194 39.754h-.44v-.756h-.65v.756h-.444v-1.812h.443v.72h.65v-.72h.44v1.812zM11.743 39.08l-.183.197v.477h-.443v-1.812h.443v.798l.154-.23.397-.568h.547l-.618.802.618 1.01h-.526l-.39-.675zM14.285 38.885c0 .177-.033.332-.1.47a.738.738 0 01-.701.423.805.805 0 01-.415-.105.73.73 0 01-.283-.304 1.02 1.02 0 01-.107-.456v-.102c0-.177.032-.336.1-.47a.736.736 0 01.283-.314.795.795 0 01.418-.11c.154 0 .293.036.415.11a.727.727 0 01.282.31c.068.135.104.29.104.463v.085h.004zm-.45-.078c0-.18-.03-.318-.094-.41a.296.296 0 00-.26-.14c-.223 0-.34.165-.351.494v.134c0 .177.028.314.09.41.06.095.15.144.264.144.11 0 .196-.045.257-.14.06-.096.09-.23.093-.407v-.085zM15.193 39.11h-.24v.644h-.442v-1.812h.722c.218 0 .386.046.511.141.122.096.182.23.182.403 0 .127-.025.23-.078.314a.558.558 0 01-.243.201l.382.731v.018h-.468l-.326-.64zm-.24-.335h.28c.086 0 .146-.02.19-.067.042-.042.064-.106.064-.183 0-.078-.022-.142-.065-.184-.043-.046-.107-.067-.19-.067h-.278v.501zM17.335 38.984h-.697v.434h.822v.336h-1.266v-1.812h1.266v.339h-.826v.381h.697v.322h.004zM18.683 39.415h-.608l-.108.339h-.472l.673-1.812h.414l.68 1.812h-.476l-.104-.34zm-.501-.34h.393l-.197-.628-.196.629zM20.93 39.754h-.44l-.65-1.127v1.127h-.444v-1.812h.444l.65 1.127v-1.127h.44v1.812zM22.797 39.27a.174.174 0 00-.068-.148.799.799 0 00-.24-.11 2.748 2.748 0 01-.282-.11c-.24-.116-.357-.275-.357-.476a.41.41 0 01.089-.265.577.577 0 01.25-.18.986.986 0 01.365-.064c.132 0 .25.025.354.071a.515.515 0 01.329.49h-.44a.22.22 0 00-.068-.172c-.046-.043-.107-.06-.186-.06a.29.29 0 00-.186.053.165.165 0 00-.068.13c0 .046.025.089.075.128a.9.9 0 00.265.116c.125.039.232.085.311.13.197.114.297.27.297.467 0 .159-.06.282-.182.374-.122.092-.287.134-.497.134a.994.994 0 01-.404-.077.6.6 0 01-.272-.216.563.563 0 01-.093-.318h.443c0 .1.025.17.075.216.05.046.133.07.247.07a.274.274 0 00.172-.045.15.15 0 00.071-.138zM24.91 38.278h-.55v1.476h-.443v-1.476h-.54v-.34h1.534v.34zM26.535 37.939v1.186c0 .135-.029.251-.086.35a.554.554 0 01-.25.226.864.864 0 01-.387.078c-.225 0-.4-.057-.529-.173a.615.615 0 01-.196-.47v-1.194h.443v1.205c.004.197.1.296.279.296.093 0 .16-.025.207-.074.047-.05.072-.13.072-.244v-1.183h.447v-.003zM26.81 39.754v-1.812h.59a.813.813 0 01.74.417c.071.134.11.279.11.445v.084a.912.912 0 01-.107.446.78.78 0 01-.3.307.849.849 0 01-.433.113h-.6zm.443-1.476v1.137h.154a.348.348 0 00.293-.134c.068-.089.103-.223.103-.4v-.077c0-.177-.032-.308-.103-.396a.355.355 0 00-.297-.134h-.15v.004zM28.951 39.754h-.44v-1.812h.44v1.812zM30.397 38.984H29.7v.434h.822v.336h-1.266v-1.812h1.266v.339h-.826v.381h.697v.322h.004zM31.65 39.27a.174.174 0 00-.067-.148.8.8 0 00-.24-.11 2.751 2.751 0 01-.282-.11c-.24-.116-.358-.275-.358-.476a.41.41 0 01.09-.265.577.577 0 01.25-.18.986.986 0 01.365-.064c.132 0 .25.025.354.071a.515.515 0 01.329.49h-.44a.22.22 0 00-.068-.172c-.046-.043-.107-.06-.186-.06a.29.29 0 00-.186.053.165.165 0 00-.068.13c0 .046.025.089.075.128.05.038.14.077.265.116.125.039.232.085.31.13.198.114.298.27.298.467 0 .159-.061.282-.183.374-.121.092-.286.134-.497.134a.994.994 0 01-.404-.077.599.599 0 01-.272-.216.564.564 0 01-.092-.318h.443c0 .1.025.17.075.216.05.046.132.07.247.07a.274.274 0 00.171-.045.158.158 0 00.072-.138z"
                fill="#0167B2"
            />
            <Path d="M35.756 0H0v35.315h35.756V0z" fill="#CBD0E4"/>
            <Path d="M32.18 3.532H3.575v28.252H32.18V3.532z" fill="#fff"/>
            <Path
                d="M9.03 11.294c-.29.477-.648.911-.92 1.406-.268.49-.497 1.003-.686 1.532a11.222 11.222 0 00-.619 3.359c-.071 2.143.626 4.442 1.816 6.23a10.129 10.129 0 005.418 4.032c1.14.35 2.374.523 3.565.36 2.213-.303 4.494-1.532 5.781-3.358.644-.915 1.059-1.999 1.08-3.122.004-.127 0-.25-.01-.378-.069-.96-.458-2.083-1.241-2.705-.866-.685-2.024-.89-3.108-.777-.1.011-.24.008-.332.043-1.173.466-1.784 1.32-1.913 2.504-.079.724-.064 1.384-.426 2.044-1.144 2.091-3.886 2.19-5.831 1.261a5.562 5.562 0 01-.651-.364c-2.178-1.395-3.33-3.538-3.637-6.296-.132-1.826.487-3.754 1.713-5.77z"
                fill="#EF3026"
            />
            <Path
                d="M28.952 17.725c-.075-2.952-1.055-5.672-3.672-7.978-2.578-2.27-6.179-3.242-9.554-2.415-2.982.73-5.442 3.076-6.365 5.96-.897 2.808-.35 6.174 2.156 8 1.627 1.186 5.335 1.811 6.186-.664.29-.844-.175-1.678-.854-2.186-.72-.537-1.699-.558-2.396-1.137-1.234-1.024-1.266-2.74-.848-4.164.44-1.487 1.58-2.716 2.972-3.404 1.498-.745 3.45-.791 5.07-.463 3.308.671 5.843 3.168 6.837 6.31.221.7.375 1.417.468 2.14z"
                fill="#0167B2"
            />
            <Path
                d="M47.495 17.216V8.873h3.79c.906 0 1.704.175 2.396.524a3.918 3.918 0 011.62 1.442c.39.62.585 1.355.585 2.205 0 .843-.195 1.578-.584 2.205-.39.62-.93 1.105-1.621 1.455-.692.341-1.49.512-2.396.512h-3.79zm1.93-1.585h1.765c.556 0 1.037-.103 1.442-.31.413-.215.73-.516.953-.906.23-.39.346-.846.346-1.37 0-.533-.115-.99-.346-1.371a2.209 2.209 0 00-.953-.894c-.405-.215-.886-.322-1.442-.322h-1.764v5.173zm-3.05-2.014v-1.288h5.148v1.288h-5.149zM59.189 12.234h4.016v1.502H59.19v-1.502zm.143 3.433h4.54v1.55h-6.46V8.872h6.306v1.55h-4.386v5.244zm-1.157-7.473l1.586-1.36h1.62l1.586 1.36h-1.37l-1.61-1.073h1.168l-1.609 1.073h-1.37zm4.542-1.145l-1.872-1.442h1.895l1.311 1.442h-1.334zM67.837 17.216l3.718-8.343h1.907l3.731 8.343h-2.026L72.116 9.85h.763l-3.064 7.366h-1.978zm1.86-1.788l.512-1.466h4.29l.525 1.466h-5.328zm1.727-7.234l1.61-1.717h2.002l-2.157 1.717h-1.455zM78.133 17.216V8.873h1.597l4.923 6.007h-.775V8.873h1.907v8.343H84.2l-4.934-6.007h.774v6.007h-1.907zM90.33 17.216l3.587-4.946v1.406l-3.432-4.803h2.193l2.372 3.35-.918.011 2.336-3.361h2.098l-3.409 4.72V12.21l3.611 5.006H96.54l-2.456-3.54h.882l-2.42 3.54H90.33zM99.599 17.216V8.873h3.79c.906 0 1.704.175 2.395.524a3.911 3.911 0 011.621 1.442c.39.62.584 1.355.584 2.205 0 .843-.194 1.578-.584 2.205a3.994 3.994 0 01-1.621 1.455c-.691.341-1.489.512-2.395.512h-3.79zm1.93-1.585h1.764c.557 0 1.037-.103 1.443-.31a2.28 2.28 0 00.953-.906c.231-.39.346-.846.346-1.37 0-.533-.115-.99-.346-1.371a2.206 2.206 0 00-.953-.894c-.406-.215-.886-.322-1.443-.322h-1.764v5.173zM114.698 17.216v-6.77h-2.67V8.873h7.271v1.573h-2.67v6.77h-1.931zM120.567 17.216V8.873h3.79c.906 0 1.705.175 2.396.524a3.917 3.917 0 011.621 1.442c.389.62.584 1.355.584 2.205 0 .843-.195 1.578-.584 2.205a4 4 0 01-1.621 1.455c-.691.341-1.49.512-2.396.512h-3.79zm1.931-1.585h1.764c.556 0 1.037-.103 1.442-.31.413-.215.731-.516.954-.906.23-.39.345-.846.345-1.37 0-.533-.115-.99-.345-1.371a2.214 2.214 0 00-.954-.894c-.405-.215-.886-.322-1.442-.322h-1.764v5.173zm-3.051-2.014v-1.288h5.149v1.288h-5.149zM136.206 8.873h1.931v8.343h-1.931V8.873zm-3.79 8.343h-1.931V8.873h1.931v8.343zm3.933-3.42h-4.076v-1.633h4.076v1.632zM145.363 17.216v-6.77h-2.669V8.873h7.27v1.573h-2.67v6.77h-1.931zM151.077 17.216V8.873h3.612c.747 0 1.39.123 1.931.37.54.238.957.583 1.251 1.036.294.453.441.994.441 1.621 0 .62-.147 1.156-.441 1.61-.294.444-.711.786-1.251 1.024-.541.239-1.184.358-1.931.358h-2.539l.858-.846v3.17h-1.931zm5.304 0l-2.086-3.027h2.062l2.11 3.027h-2.086zm-3.373-2.956l-.858-.906h2.432c.595 0 1.04-.127 1.334-.381.294-.262.441-.62.441-1.073 0-.46-.147-.818-.441-1.072-.294-.255-.739-.382-1.334-.382h-2.432l.858-.918v4.732zM163.969 17.36c-.66 0-1.272-.108-1.836-.323a4.41 4.41 0 01-1.454-.905 4.25 4.25 0 01-.953-1.371 4.34 4.34 0 01-.334-1.716c0-.62.111-1.192.334-1.717.23-.524.552-.981.965-1.37.413-.39.898-.692 1.454-.906a4.991 4.991 0 011.812-.322c.659 0 1.263.107 1.811.322a4.28 4.28 0 011.443.906 4.162 4.162 0 011.311 3.086c0 .62-.115 1.196-.346 1.729-.23.524-.552.981-.965 1.37a4.38 4.38 0 01-1.443.894 4.895 4.895 0 01-1.799.322zm-.012-1.646c.373 0 .715-.063 1.025-.19a2.45 2.45 0 001.382-1.395c.136-.326.203-.687.203-1.085 0-.397-.067-.758-.203-1.084a2.42 2.42 0 00-.548-.846 2.328 2.328 0 00-.822-.549 2.77 2.77 0 00-1.037-.19c-.374 0-.719.063-1.037.19a2.48 2.48 0 00-.822.549 2.57 2.57 0 00-.561.846c-.127.326-.19.687-.19 1.084 0 .39.063.751.19 1.085.135.326.318.608.549.846.238.239.516.421.834.549.318.127.663.19 1.037.19zm0 4.005a.84.84 0 01-.584-.215c-.159-.143-.239-.337-.239-.584 0-.246.08-.449.239-.607a.815.815 0 01.584-.227c.23 0 .425.076.584.227a.823.823 0 01.238.607c0 .247-.079.441-.238.584a.842.842 0 01-.584.215zM170.047 17.216V8.873h1.597l4.923 6.007h-.775V8.873h1.907v8.343h-1.585l-4.934-6.007h.774v6.007h-1.907zM183.776 17.36a5.197 5.197 0 01-1.823-.31 4.442 4.442 0 01-1.443-.907 4.25 4.25 0 01-.953-1.37 4.371 4.371 0 01-.334-1.729c0-.627.111-1.203.334-1.728.23-.524.552-.981.965-1.37.414-.39.898-.688 1.454-.894a5.064 5.064 0 011.836-.322c.739 0 1.402.123 1.99.37a3.942 3.942 0 011.502 1.072l-1.239 1.144a2.945 2.945 0 00-.99-.703 2.842 2.842 0 00-1.168-.238c-.405 0-.774.063-1.108.19-.334.128-.624.31-.87.549-.239.238-.425.52-.56.846a2.943 2.943 0 00-.191 1.084c0 .39.063.747.191 1.073.135.326.321.612.56.858.246.239.532.421.858.549.334.127.699.19 1.096.19.382 0 .751-.06 1.109-.178a3.3 3.3 0 001.061-.632l1.096 1.394a5.018 5.018 0 01-1.585.787 6.073 6.073 0 01-1.788.274zm1.609-1.312v-3.135h1.764v3.385l-1.764-.25zM192.622 17.216V8.873h3.79c.906 0 1.705.175 2.396.524a3.917 3.917 0 011.621 1.442c.389.62.584 1.355.584 2.205 0 .843-.195 1.578-.584 2.205a4 4 0 01-1.621 1.455c-.691.341-1.49.512-2.396.512h-3.79zm1.931-1.585h1.764c.556 0 1.037-.103 1.442-.31.413-.215.731-.516.954-.906.23-.39.345-.846.345-1.37 0-.533-.115-.99-.345-1.371a2.214 2.214 0 00-.954-.894c-.405-.215-.886-.322-1.442-.322h-1.764v5.173zm-3.051-2.014v-1.288h5.149v1.288h-5.149zM202.54 17.216V8.873h1.931v8.343h-1.931zM208.301 12.234h4.017v1.502h-4.017v-1.502zm.143 3.433h4.541v1.55h-6.46V8.872h6.305v1.55h-4.386v5.244zm-1.156-7.473l1.585-1.36h1.621l1.585 1.36h-1.37L209.1 7.12h1.168l-1.609 1.073h-1.371zm4.517-.918l-.453-.441c.159-.08.271-.163.334-.25a.4.4 0 00.107-.25.303.303 0 00-.119-.251.414.414 0 00-.286-.095 1.13 1.13 0 00-.524.143l-.31-.572a1.43 1.43 0 01.465-.191c.174-.048.349-.072.524-.072.334 0 .6.088.799.263.198.166.298.393.298.679 0 .238-.08.449-.239.632a1.421 1.421 0 01-.596.405zM214.596 17.216V8.873h1.597l3.552 5.888h-.846l3.492-5.888h1.585l.024 8.343h-1.812l-.012-5.566h.334l-2.789 4.684h-.87l-2.849-4.684h.406v5.566h-1.812zM49.843 33.108l-3.6-8.343h2.086l3.147 7.39h-1.228l3.194-7.39h1.92l-3.612 8.343h-1.907zM57.908 28.126h4.017v1.502h-4.017v-1.502zm.143 3.432h4.541v1.55h-6.46v-8.343h6.305v1.55h-4.386v5.243zm-1.156-7.473l1.585-1.358h1.621l1.586 1.358h-1.371l-1.61-1.072h1.169l-1.61 1.072h-1.37zm4.541-1.144l-1.871-1.442h1.895l1.311 1.442h-1.335zM73.374 24.765h1.93v8.343h-1.93v-8.343zm-3.79 8.343h-1.931v-8.343h1.93v8.343zm3.933-3.42h-4.076v-1.634h4.076v1.633zM76.257 33.108l3.718-8.343h1.907l3.731 8.343h-2.026l-3.051-7.366h.762l-3.063 7.366h-1.978zm1.86-1.788l.512-1.466h4.29l.525 1.466h-5.328zm2.442-7.235l-2.157-1.716h2.002l1.61 1.716H80.56zM86.553 33.108v-8.343h1.597l4.923 6.007h-.775v-6.007h1.907v8.343H92.62L87.685 27.1h.775v6.007h-1.907zM103.744 33.25c-.652 0-1.26-.106-1.824-.321a4.409 4.409 0 01-1.454-.906 4.257 4.257 0 01-.953-1.37 4.35 4.35 0 01-.334-1.717c0-.62.111-1.192.334-1.716.23-.524.552-.981.965-1.37.413-.39.898-.692 1.454-.907a4.992 4.992 0 011.812-.321 4.93 4.93 0 011.811.321 4.28 4.28 0 011.443.906c.413.382.735.834.965 1.359.23.524.346 1.1.346 1.728 0 .62-.116 1.196-.346 1.728-.23.525-.552.982-.965 1.371a4.38 4.38 0 01-1.443.894 4.93 4.93 0 01-1.811.322zm2.729 1.777c-.326 0-.635-.036-.929-.108a3.521 3.521 0 01-.859-.345 5.592 5.592 0 01-.882-.644c-.302-.27-.631-.604-.989-1.001l2.026-.513c.215.295.414.529.596.704.183.175.358.298.525.37.175.07.357.106.548.106.508 0 .961-.206 1.359-.62l.858 1.026c-.564.683-1.315 1.025-2.253 1.025zm-2.729-3.421c.373 0 .715-.064 1.025-.19a2.45 2.45 0 001.382-1.395c.135-.334.203-.695.203-1.085 0-.397-.068-.759-.203-1.084a2.42 2.42 0 00-.548-.847 2.452 2.452 0 00-.834-.548 2.677 2.677 0 00-1.025-.19c-.374 0-.719.063-1.037.19-.318.127-.596.31-.834.548-.231.239-.414.52-.549.847-.127.325-.19.687-.19 1.084 0 .39.063.751.19 1.085.135.326.318.608.549.846.238.238.516.421.834.548.318.127.663.191 1.037.191zM113.541 33.25c-1.184 0-2.11-.329-2.777-.989-.667-.659-1.001-1.6-1.001-2.824v-4.672h1.931v4.6c0 .795.163 1.367.488 1.717.326.35.783.524 1.371.524s1.045-.175 1.371-.524c.325-.35.488-.922.488-1.717v-4.6h1.907v4.672c0 1.223-.333 2.165-1.001 2.824-.667.66-1.593.99-2.777.99zM123.354 33.25a5.121 5.121 0 01-1.835-.321 4.399 4.399 0 01-1.454-.906 4.251 4.251 0 01-.954-1.37 4.358 4.358 0 01-.334-1.717c0-.62.112-1.192.334-1.716.231-.524.552-.981.966-1.37.413-.39.897-.692 1.454-.907a4.99 4.99 0 011.811-.321c.66 0 1.264.107 1.812.321a4.275 4.275 0 011.442.906 4.163 4.163 0 011.311 3.087c0 .62-.115 1.196-.346 1.728-.23.525-.552.982-.965 1.371-.405.382-.886.68-1.442.894a4.897 4.897 0 01-1.8.322zm-.012-1.644c.374 0 .715-.064 1.025-.19a2.434 2.434 0 001.383-1.394c.135-.327.202-.689.202-1.086 0-.397-.067-.759-.202-1.084a2.435 2.435 0 00-.548-.847 2.342 2.342 0 00-.823-.548 2.764 2.764 0 00-1.037-.19c-.373 0-.719.063-1.037.19-.31.127-.584.31-.822.548-.238.239-.425.52-.56.847a2.963 2.963 0 00-.191 1.084c0 .39.064.751.191 1.085.135.326.318.608.548.846.238.238.516.421.834.548.318.127.664.191 1.037.191zm-2.395-7.52l1.585-1.36h1.621l1.585 1.36h-1.371l-1.609-1.073h1.168l-1.609 1.072h-1.37zm3.826-1.145l1.322-1.442h1.896l-1.872 1.442h-1.346zM133.426 33.25a5.127 5.127 0 01-1.8-.31 4.237 4.237 0 01-2.384-2.276 4.389 4.389 0 01-.334-1.728c0-.628.112-1.204.334-1.728.23-.524.548-.981.954-1.37a4.27 4.27 0 011.442-.895 4.895 4.895 0 011.799-.321c.724 0 1.375.127 1.955.381a3.755 3.755 0 011.478 1.096l-1.239 1.145a2.835 2.835 0 00-.954-.727 2.622 2.622 0 00-1.144-.25c-.39 0-.747.063-1.073.19-.326.127-.608.31-.846.548-.239.239-.425.52-.56.847a2.963 2.963 0 00-.191 1.084c0 .398.064.759.191 1.085.135.326.321.608.56.846.238.238.52.421.846.548.326.127.683.191 1.073.191.413 0 .794-.08 1.144-.238.35-.167.667-.417.954-.751l1.239 1.144c-.397.485-.89.854-1.478 1.108-.58.255-1.235.382-1.966.382zM147.419 24.765h1.931v8.343h-1.931v-8.343zm-3.79 8.343h-1.931v-8.343h1.931v8.343zm3.933-3.42h-4.076v-1.634h4.076v1.633zM155.451 33.25a5.121 5.121 0 01-1.835-.321 4.413 4.413 0 01-1.455-.906 4.248 4.248 0 01-.953-1.37 4.34 4.34 0 01-.334-1.717c0-.62.111-1.192.334-1.716.23-.524.552-.981.965-1.37.414-.39.898-.692 1.454-.907a5 5 0 011.812-.321c.66 0 1.263.107 1.812.321a4.275 4.275 0 011.442.906 4.163 4.163 0 011.311 3.087c0 .62-.115 1.196-.346 1.728-.23.525-.552.982-.965 1.371-.405.382-.886.68-1.442.894a4.9 4.9 0 01-1.8.322zm-.012-1.644c.374 0 .715-.064 1.025-.19a2.45 2.45 0 001.383-1.395c.135-.326.202-.688.202-1.085s-.067-.759-.202-1.084a2.423 2.423 0 00-.549-.847 2.329 2.329 0 00-.822-.548 2.764 2.764 0 00-1.037-.19c-.373 0-.719.063-1.037.19-.31.127-.584.31-.822.548-.239.239-.425.52-.56.847a2.943 2.943 0 00-.191 1.084c0 .39.063.751.191 1.085.135.326.317.608.548.846.238.238.516.421.834.548.318.127.664.191 1.037.191zm0 4.005a.842.842 0 01-.584-.215c-.159-.143-.238-.337-.238-.584 0-.246.079-.449.238-.608a.817.817 0 01.584-.226c.231 0 .425.075.584.226a.823.823 0 01.238.608c0 .247-.079.441-.238.584a.84.84 0 01-.584.215zM165.522 33.25a5.126 5.126 0 01-1.799-.31 4.25 4.25 0 01-2.384-2.276 4.371 4.371 0 01-.334-1.728c0-.628.111-1.204.334-1.728.23-.524.548-.981.953-1.37.414-.39.894-.688 1.443-.895a4.895 4.895 0 011.799-.321c.723 0 1.375.127 1.955.381a3.755 3.755 0 011.478 1.096l-1.24 1.145a2.831 2.831 0 00-.953-.727 2.622 2.622 0 00-1.144-.25c-.39 0-.747.063-1.073.19-.326.127-.608.31-.846.548-.239.239-.425.52-.56.847a2.943 2.943 0 00-.191 1.084c0 .398.063.759.191 1.085.135.326.321.608.56.846.238.238.52.421.846.548.326.127.683.191 1.073.191.413 0 .794-.08 1.144-.238.349-.167.667-.417.953-.751l1.24 1.144c-.397.485-.89.854-1.478 1.108-.58.255-1.236.382-1.967.382zM175.523 33.108v-6.77h-2.669v-1.573h7.27v1.573h-2.67v6.77h-1.931zM179.722 33.108l3.719-8.343h1.907l3.73 8.343h-2.026l-3.051-7.366h.763l-3.064 7.366h-1.978zm1.859-1.788l.513-1.466h4.291l.524 1.466h-5.328zm2.813 4.29a.842.842 0 01-.584-.214c-.159-.143-.238-.337-.238-.584 0-.246.079-.449.238-.608a.817.817 0 01.584-.226c.23 0 .425.075.584.226a.823.823 0 01.238.608c0 .247-.079.441-.238.584a.842.842 0 01-.584.215zM190.018 33.108v-8.343h1.931v8.343h-1.931zM199.956 33.108l-3.599-8.343h2.086l3.146 7.39h-1.227l3.194-7.39h1.919l-3.612 8.343h-1.907zM206.246 33.108v-8.343h1.597l4.922 6.007h-.774v-6.007h1.907v8.343h-1.585l-4.935-6.007h.775v6.007h-1.907z"
                fill={fillText ?'#484848' : "#B0B0B0"}
            />
        </Svg>
    );
};

export default ICLogo;