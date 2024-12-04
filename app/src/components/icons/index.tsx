interface IClickableIconProps {
  onClick?: () => void
  color?: string
}

export const RiArrowRightSLine = ({ onClick }: IClickableIconProps) => (
  <svg
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    onClick={onClick}
    className='cursor-pointer text-white hover:bg-black/80'
  >
    <path
      d='M9.57819 12.0535C10.2388 11.518 10.8266 11.0378 11.4179 10.5617C12.3864 9.78212 13.3694 9.02045 14.3206 8.21955C14.7172 7.8856 15.0509 7.47237 15.4071 7.08925C15.56 6.92477 15.6936 6.71307 15.5122 6.51482C15.3109 6.29463 15.0913 6.43326 14.9232 6.60451C13.1159 8.44754 10.8786 9.71207 8.89286 11.3153C8.30774 11.7878 8.2315 12.1857 8.72693 12.7703C8.88029 12.9577 9.0468 13.1333 9.22514 13.2959C10.5212 14.4362 11.8088 15.5874 13.1305 16.6959C13.5548 17.0517 14.0696 17.2968 14.5533 17.5737C14.6358 17.6209 14.8531 17.6018 14.8659 17.5633C14.9137 17.422 14.966 17.2153 14.8996 17.1128C14.6383 16.71 14.378 16.2866 14.0342 15.9637C13.2043 15.1844 12.3262 14.4593 11.4709 13.7084C10.9679 13.2667 10.4722 12.8162 9.97119 12.372C9.8616 12.275 9.74365 12.1874 9.57819 12.0535Z'
      fill='#FFFFFF'
    />
  </svg>
)

export const RiArrowLeftSLine = ({ onClick }: IClickableIconProps) => (
  <svg
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    onClick={onClick}
    className='cursor-pointer text-white hover:bg-black/80'
  >
    <g id='Icons / Default icons/Arrow down'>
      <path
        d='M14.4218 12.0535C13.7612 11.518 13.1734 11.0378 12.5821 10.5617C11.6136 9.78212 10.6306 9.02045 9.67939 8.21955C9.28281 7.8856 8.94909 7.47237 8.59294 7.08925C8.43997 6.92477 8.30642 6.71307 8.4878 6.51482C8.68908 6.29463 8.90875 6.43326 9.07676 6.60451C10.8841 8.44754 13.1214 9.71207 15.1071 11.3153C15.6923 11.7878 15.7685 12.1857 15.2731 12.7703C15.1197 12.9577 14.9532 13.1333 14.7749 13.2959C13.4788 14.4362 12.1912 15.5874 10.8695 16.6959C10.4452 17.0517 9.9304 17.2968 9.44667 17.5737C9.36422 17.6209 9.14695 17.6018 9.13406 17.5633C9.0863 17.422 9.03401 17.2153 9.10038 17.1128C9.36167 16.71 9.622 16.2866 9.96581 15.9637C10.7957 15.1844 11.6738 14.4593 12.5291 13.7084C13.0321 13.2667 13.5278 12.8162 14.0288 12.372C14.1384 12.275 14.2563 12.1874 14.4218 12.0535Z'
        fill='#FFFFFF'
      />
    </g>
  </svg>
)

export const RiArrowDown = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g id='Icons / Default icons/Another icon'>
      <path
        id='another-icon-path'
        d='M11.9465 14.4199C12.482 13.7593 12.9622 13.1715 13.4383 12.5801C14.2179 11.6116 14.9795 10.6287 15.7805 9.67744C16.1144 9.28086 16.5276 8.94714 16.9107 8.59099C17.0752 8.43802 17.2869 8.30447 17.4852 8.48585C17.7054 8.68712 17.5667 8.90679 17.3955 9.0748C15.5525 10.8821 14.2879 13.1195 12.6847 15.1052C12.2122 15.6903 11.8143 15.7665 11.2297 15.2711C11.0423 15.1178 10.8667 14.9512 10.7041 14.7729C9.56382 13.4768 8.41257 12.1893 7.30414 10.8676C6.94825 10.4432 6.7032 9.92845 6.42626 9.44472C6.37912 9.36227 6.3982 9.145 6.43669 9.1321C6.57802 9.08435 6.78474 9.03205 6.88717 9.09843C7.29002 9.35971 7.71344 9.62005 8.0363 9.96386C8.81559 10.7937 9.54065 11.6719 10.2916 12.5271C10.7333 13.0302 11.1838 13.5259 11.628 14.0269C11.725 14.1364 11.8126 14.2544 11.9465 14.4199Z'
        fill='#8379BD'
      />
    </g>
  </svg>
)

export const UnreadMarker = () => (
  <svg width='21' height='16' viewBox='0 0 21 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='0.5' y='0.5' width='20' height='15' stroke='#47444F' />
  </svg>
)
export const MessageIcon = ({ count }: { count: number }) => (
  <svg width='26' height='28' viewBox='0 0 26 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M11.8565 18.7884C11.1919 18.7884 10.0515 18.7029 9.43238 18.7884C8.4129 19.5395 7.81479 20.1298 6.70523 20.7526C5.38353 21.4945 6.12184 20.956 4.83911 21.7572C4.26092 22.1184 2.37978 22.5114 2.37978 22.5114C3.52593 20.6047 2.6137 22.1788 3.52593 20.2156C3.61953 20.0142 4.07908 18.9828 3.93833 18.7884C3.73987 18.5143 1.85697 18.4085 1.34454 17.4691C0.667646 15.6738 1.19092 13.5785 1.22516 11.7242C1.24235 10.7935 1.42051 9.89842 1.42051 8.96574C1.42051 8.36303 1.61154 4.93512 1.7889 4.3667C2.27168 2.81948 2.2018 3.19959 3.52593 2.54923C4.3937 2.12302 6.26042 2.33335 7.3112 2.33335C8.1001 2.33335 8.41422 2.41134 8.81119 2.33335C9.53825 2.19051 10.3919 2.31477 11.0903 2.0575C11.3983 1.94403 11.8522 2.03351 12.1647 2.03351C12.8646 2.03351 13.5559 2.08072 14.2538 2.14146C14.829 2.1915 15.3978 2.2494 15.974 2.2494C17.6183 2.2494 20.7225 2.33335 20.7225 2.33335C20.7225 2.33335 23.6222 2.48901 23.7933 4.19118C23.8143 4.40002 23.7704 5.8107 23.7933 6.03934C23.8265 6.36862 23.9068 6.69751 23.9616 7.0228C24.0946 7.81328 23.8131 8.31635 23.9616 9.1001V11.4668C23.9616 12.053 23.7842 13.079 23.9616 13.8335C23.9616 14.6224 24.1034 15.069 23.8856 15.7061C23.6521 16.3892 23.3914 17.2263 22.7623 17.5891C21.8642 18.1069 20.7583 18.7404 19.7349 18.7404H15.1897C14.4037 18.7404 12.6325 18.7884 11.8565 18.7884Z'
      fill='#DBF8CA'
      stroke='#47444F'
      strokeLinecap='round'
    />
    {count > 0 && (
      <path
        d='M23.2086 2C23.3099 2.49615 23.8349 2.98241 23.9504 3.49808C24.0936 4.13749 23.9333 4.83433 23.3815 5.40794C23.0666 5.73531 22.2548 6.29404 21.6818 5.81187C21.1159 5.33566 20.5079 4.87823 20.0469 4.36477C19.8935 4.19387 20.1477 4.11049 20.3566 3.98045C20.5604 3.85361 22.1618 2.3423 22.5604 2.77649'
        stroke='#F59494'
        strokeWidth='3.6'
        strokeLinecap='round'
      />
    )}
    <text
      x='50%'
      y='50%'
      textAnchor='middle'
      alignmentBaseline='middle'
      fontSize='8'
      fill='#343434'
    >
      {!!count && '+'}
      {count}
    </text>
  </svg>
)
export const UpdateIcon = ({ count }: { count: number }) => (
  <svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='14.5' cy='13.5' r='10.5' fill='#DBF8CA' />
    <path
      d='M4 10.5C4.45543 9.15939 6 6.5 7 5.5C8.96763 3.53237 11.801 3 14.5834 3C16.7494 3 19.3732 3.77176 21.0018 5.25563C21.8959 6.07025 23.3265 7.2848 23.6079 8.5274C23.7075 8.9673 23.7744 9.37296 23.9493 9.81154C24.0359 10.0287 25.1122 12.0438 24.9496 11.9374C24.8096 11.8459 24.0634 11.5114 23.9038 11.4418C23.0694 11.078 22.893 10.719 22 10.5M24.598 11.2408C25.329 12.1512 25.0121 12.3459 25.3605 11.252C25.576 10.5752 26.0536 9.57227 26.3159 9.2562'
      stroke='#47444F'
      strokeLinecap='round'
    />
    <path
      d='M24.5 16C24.051 17.8182 22.6531 19.3636 21.4719 20.7065C19.9592 22.0909 17 23.5 14.5 23.5C10.2574 23.5 7.83673 21.6364 4.69388 18C4.2449 17.0909 3.84515 15.6909 3.55791 14.668C3.36657 13.9866 3.6738 13.3015 3.28489 14.2248C3.04439 14.7958 1.92652 18.629 2.00382 16.2635C2.0346 15.3217 2.71473 14.4361 2.75987 13.6265C2.80868 12.7508 3.02512 12.8834 3.4109 13.4713C3.86587 14.1648 4.97787 15.1733 5.78403 15.222'
      stroke='#47444F'
      strokeLinecap='round'
    />
    {count > 0 && (
      <path
        d='M22.2086 4C22.3099 4.49615 22.8349 4.98241 22.9504 5.49808C23.0936 6.13749 22.9333 6.83433 22.3815 7.40794C22.0666 7.73531 21.2548 8.29404 20.6818 7.81187C20.1159 7.33566 19.5079 6.87823 19.0469 6.36477C18.8935 6.19387 19.1477 6.11049 19.3566 5.98045C19.5604 5.85361 21.1618 4.3423 21.5604 4.77649'
        stroke='#F59494'
        strokeWidth='3.6'
        strokeLinecap='round'
      />
    )}
    <path
      d='M7.728 10.16H8.568L10.516 14.652H10.564V10.156H11.232V16H10.392L8.444 11.432H8.396V16H7.728V10.16ZM13.7969 12.564C13.6636 12.6627 13.5476 12.8093 13.4489 13.004C13.3503 13.1987 13.3009 13.46 13.3009 13.788C13.3009 14.1267 13.3476 14.4187 13.4409 14.664C13.5343 14.9067 13.6996 15.1 13.9369 15.244C14.1743 15.3853 14.5009 15.456 14.9169 15.456C15.1409 15.456 15.3543 15.4373 15.5569 15.4C15.7623 15.36 15.9543 15.308 16.1329 15.244L16.0969 15.844C15.9076 15.916 15.6969 15.976 15.4649 16.024C15.2329 16.072 14.9809 16.096 14.7089 16.096C14.2423 16.096 13.8489 16.016 13.5289 15.856C13.2089 15.696 12.9676 15.464 12.8049 15.16C12.6423 14.8533 12.5609 14.484 12.5609 14.052C12.5609 13.5613 12.6609 13.1467 12.8609 12.808C13.0609 12.4693 13.3263 12.216 13.6569 12.048C13.9876 11.88 14.3503 11.796 14.7449 11.796C15.1156 11.796 15.4169 11.868 15.6489 12.012C15.8836 12.156 16.0529 12.3507 16.1569 12.596C16.2636 12.8413 16.3169 13.124 16.3169 13.444V13.924H13.1969V13.464H15.7489L15.5449 13.744C15.5583 13.6827 15.5689 13.6187 15.5769 13.552C15.5876 13.4853 15.5929 13.412 15.5929 13.332C15.5929 13.116 15.5556 12.9373 15.4809 12.796C15.4063 12.652 15.2929 12.544 15.1409 12.472C14.9889 12.4 14.7969 12.364 14.5649 12.364C14.3916 12.364 14.2409 12.3827 14.1129 12.42C13.9849 12.4573 13.8796 12.5053 13.7969 12.564ZM20.1979 15.996C20.0325 15.556 19.8859 15.12 19.7579 14.688C19.6299 14.256 19.5219 13.8467 19.4339 13.46H19.3699C19.1539 14.3533 18.8845 15.1987 18.5619 15.996H18.0699C17.7792 15.308 17.5472 14.6293 17.3739 13.96C17.2032 13.2907 17.0872 12.6013 17.0259 11.892H17.7699C17.8152 12.4227 17.8925 12.9413 18.0019 13.448C18.1112 13.952 18.2445 14.4373 18.4019 14.904H18.4659C18.5912 14.5787 18.7112 14.2213 18.8259 13.832C18.9432 13.4427 19.0512 13.0507 19.1499 12.656L19.1699 12.58H19.7099L19.7579 12.78C19.8459 13.148 19.9405 13.5173 20.0419 13.888C20.1459 14.256 20.2525 14.5947 20.3619 14.904H20.4259C20.5859 14.4267 20.7232 13.936 20.8379 13.432C20.9525 12.9253 21.0339 12.412 21.0819 11.892H21.7779C21.7165 12.604 21.5979 13.2947 21.4219 13.964C21.2485 14.6307 21.0125 15.308 20.7139 15.996H20.1979Z'
      fill='#343434'
    />
  </svg>
)

export const Minus = ({ onClick, color = '#FFFFFF' }: IClickableIconProps) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='cursor-pointer'
    onClick={onClick}
  >
    <path
      d='M12.4298 11.0315C13.3692 11.0469 14.2913 11.0449 15.2123 11.0808C16.6825 11.1385 18.1517 11.2216 19.6213 11.2942C19.6747 11.2968 19.7277 11.3056 19.7813 11.308C20.0382 11.3204 20.2728 11.3791 20.318 11.6798C20.3518 11.905 20.1014 12.1345 19.7633 12.1415C18.9211 12.159 18.0787 12.1554 17.236 12.145C15.6978 12.1266 14.1596 12.0973 12.6215 12.0738C12.2308 12.0997 11.8405 12.041 11.4456 12.0481C10.5188 12.0649 9.61276 12.0626 8.70882 12.1031C7.84058 12.142 6.9745 12.2304 6.10712 12.2867C5.77439 12.3147 5.44009 12.3197 5.10656 12.3017C4.83145 12.2815 4.61886 12.1182 4.60871 11.8182C4.59855 11.5225 4.81792 11.3956 5.07143 11.3558C5.54481 11.269 6.02268 11.2083 6.50284 11.1739C8.01217 11.1054 9.52269 11.064 11.0328 11.0127C11.9329 10.9815 11.9984 11.0127 12.4298 11.0315Z'
      fill={color}
    />
  </svg>
)
export const Plus = ({ onClick, color = '#FFFFFF' }: IClickableIconProps) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='cursor-pointer'
    onClick={onClick}
  >
    <path
      d='M11.4429 11.0065C11.4714 9.60792 11.5056 8.24617 11.5245 6.88419C11.5356 6.09518 11.5155 5.30579 11.5245 4.51679C11.5243 4.30419 11.5597 4.09315 11.6293 3.89243C11.6653 3.79494 11.8358 3.67105 11.9218 3.68679C12.0359 3.70784 12.1503 3.83971 12.2205 3.95153C12.2718 4.03301 12.2597 4.15891 12.2628 4.26521C12.3175 6.28383 12.3711 8.30231 12.4236 10.3206C12.4295 10.547 12.4286 10.7736 12.4309 11.0295C13.3703 11.0449 14.2924 11.0429 15.2134 11.0788C16.6836 11.1365 18.1528 11.2197 19.6224 11.2922C19.6758 11.2948 19.7288 11.3036 19.7824 11.306C20.0393 11.3185 20.2739 11.3771 20.3191 11.6779C20.3529 11.9031 20.1025 12.1325 19.7643 12.1395C18.9222 12.157 18.0797 12.1534 17.2371 12.1431C15.6989 12.1247 14.1607 12.0953 12.6226 12.0719C12.5621 12.0759 12.502 12.084 12.4426 12.0963C12.4562 13.1999 12.4739 14.2954 12.4824 15.3912C12.4919 16.6618 12.4966 17.9325 12.4967 19.2031C12.4972 19.6802 12.3495 19.9246 12.0646 19.9515C11.7694 19.9793 11.5429 19.7399 11.5261 19.2408C11.4805 17.8913 11.4676 16.5408 11.4533 15.1902C11.4422 14.1612 11.4482 13.1318 11.4467 12.0462C10.5199 12.0629 9.61385 12.0607 8.70991 12.1012C7.84167 12.1401 6.9756 12.2284 6.10821 12.2848C5.77548 12.3128 5.44119 12.3178 5.10766 12.2998C4.83254 12.2795 4.61995 12.1162 4.60981 11.8162C4.59964 11.5205 4.81901 11.3936 5.07252 11.3538C5.5459 11.2671 6.02377 11.2063 6.50394 11.1719C8.01327 11.1034 9.52378 11.062 11.0339 11.0108C11.1532 11.0066 11.2731 11.0081 11.4429 11.0065Z'
      fill={color}
    />
  </svg>
)
export const DownloadIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g clipPath='url(#clip0_2249_17820)'>
      <path
        d='M10.77 15.4119C10.6252 15.303 10.475 15.2016 10.32 15.1078L10.2867 15.0885C9.88959 14.8574 9.47908 14.6184 9.06375 14.4034C8.95701 14.3482 8.84966 14.287 8.7458 14.2277C8.4611 14.0653 8.16682 13.8975 7.82934 13.8169C7.81449 13.8133 7.79891 13.8141 7.78447 13.8191C7.77004 13.8241 7.75735 13.8331 7.74791 13.8451L7.58746 14.0476C7.57837 14.0591 7.57265 14.0729 7.57089 14.0875C7.56913 14.102 7.57142 14.1167 7.5775 14.13C7.58855 14.1542 7.59773 14.1789 7.60676 14.2028C7.62542 14.2628 7.65463 14.3189 7.69303 14.3686C8.56784 15.3851 9.63931 16.2939 11.1668 17.3156C11.2599 17.3747 11.3575 17.427 11.4585 17.4718C11.593 17.5391 11.741 17.5755 11.8916 17.5784C12.0937 17.5759 12.2882 17.5004 12.4388 17.3661C12.471 17.339 12.5039 17.3125 12.5367 17.286C12.6076 17.2292 12.6807 17.1703 12.748 17.1048C12.9335 16.9243 13.1199 16.7446 13.3071 16.5657C13.8034 16.0894 14.3165 15.5968 14.7966 15.0881C15.094 14.759 15.3704 14.4116 15.6243 14.0481C15.7091 13.9318 15.7938 13.8155 15.88 13.7008L15.8895 13.6881C15.9393 13.6231 16.0557 13.471 15.8841 13.2933C15.87 13.2787 15.8508 13.27 15.8305 13.2689C15.5401 13.2546 15.3466 13.424 15.1601 13.5889C15.0902 13.6537 15.016 13.7135 14.9377 13.7679C14.6453 13.9688 14.3662 14.1883 14.1023 14.425L14.0541 14.4664C13.9192 14.5822 13.7889 14.7063 13.663 14.8262C13.5426 14.9409 13.4181 15.0595 13.291 15.1693C13.2035 15.2448 13.1213 15.3286 13.0419 15.4095C12.8935 15.5748 12.7228 15.7187 12.5345 15.837C12.5334 15.8285 12.5324 15.8203 12.5314 15.812C12.5209 15.7451 12.5155 15.6775 12.5153 15.6099C12.5277 15.1753 12.5411 14.7407 12.5558 14.306C12.5783 13.6119 12.6016 12.8941 12.6169 12.1877C12.6217 11.9668 12.6267 11.7458 12.6319 11.5248C12.6777 9.54794 12.725 7.50456 12.5454 5.49597C12.481 4.77501 12.3718 4.0475 12.2663 3.34367L12.222 3.04744C12.195 2.93533 12.1456 2.82984 12.0765 2.73735C12.0343 2.66959 11.9865 2.59278 11.933 2.49479C11.9258 2.4816 11.9151 2.47072 11.9019 2.46337C11.8888 2.45602 11.8738 2.45246 11.8587 2.45323C11.8437 2.45399 11.8291 2.45898 11.8168 2.46761C11.8044 2.47625 11.7948 2.4882 11.789 2.50206C11.6068 2.93432 11.6009 3.3069 11.5956 3.63551C11.5939 3.75032 11.5921 3.85889 11.5836 3.96665C11.5689 4.15208 11.551 4.33728 11.5331 4.52233C11.5104 4.7559 11.487 4.99746 11.4708 5.23607C11.4474 5.57973 11.4328 5.92941 11.4188 6.26748C11.4142 6.37477 11.4097 6.48202 11.4051 6.58931L11.4001 6.70188C11.3821 7.1084 11.3636 7.52872 11.3499 7.94261C11.3374 8.32588 11.3278 8.73096 11.3198 9.21741C11.3147 9.5275 11.312 9.83803 11.3094 10.1485L11.3055 10.5713C11.3041 10.7119 11.3024 10.8526 11.3004 10.9932C11.2965 11.2987 11.2926 11.6147 11.2926 11.9257C11.293 12.3258 11.2955 12.7996 11.3103 13.2813C11.3164 13.4806 11.3281 13.6826 11.3396 13.8782C11.3525 14.0994 11.3658 14.3278 11.3707 14.5526C11.3738 14.6881 11.3849 14.8261 11.3956 14.9595C11.4283 15.245 11.43 15.5333 11.4007 15.8192C11.1798 15.7004 10.9689 15.5642 10.77 15.4119Z'
        fill='#FFFFFF'
      />
      <path
        d='M20.8122 12.3406C20.7586 12.311 20.6992 12.2932 20.638 12.2886C20.5768 12.284 20.5154 12.2927 20.4578 12.3139C20.4466 12.317 20.4362 12.3225 20.4273 12.33C20.4185 12.3375 20.4114 12.3469 20.4065 12.3574C20.1986 12.807 20.1408 15.2348 20.0986 17.0075C20.0821 17.7 20.0687 18.259 20.0504 18.5294C19.9529 18.5386 19.861 18.5484 19.7733 18.5577C19.5553 18.581 19.367 18.6008 19.1775 18.6053C18.4196 18.6234 17.5236 18.6417 16.6231 18.6417H16.6098C16.016 18.6417 15.422 18.6425 14.828 18.6441C12.9552 18.6474 11.0185 18.6513 9.11462 18.6169C7.99262 18.5966 6.85187 18.5247 5.74864 18.4551C5.28472 18.4258 4.80501 18.3957 4.33292 18.3699C4.2456 18.3631 4.15873 18.3514 4.07274 18.3348C4.0416 18.3295 4.00968 18.3241 3.97613 18.3188C3.96998 18.2777 3.96343 18.2372 3.95697 18.1971C3.93554 18.0784 3.9205 17.9585 3.9119 17.8382C3.89243 17.4656 3.87633 17.0928 3.86013 16.72C3.83195 16.0703 3.80283 15.3986 3.75597 14.7386C3.70614 14.0348 3.63514 12.8529 3.59738 12.2113C3.59091 12.0904 3.53864 11.9763 3.45109 11.8922C3.36356 11.8081 3.24725 11.7601 3.1256 11.7579C3.0007 11.7553 2.87959 11.8006 2.78742 11.8846C2.69525 11.9686 2.6391 12.0847 2.63062 12.2088C2.55378 13.4036 2.38414 16.3627 2.46806 18.0312L2.47344 18.146C2.47624 18.4035 2.50577 18.6602 2.56157 18.9117C2.67718 19.3569 2.9446 19.5566 3.45554 19.5794C3.86107 19.5977 4.26652 19.6191 4.67189 19.6406C5.31805 19.6748 5.98671 19.7104 6.64502 19.7312C8.08846 19.7777 9.39542 19.8042 10.6406 19.8132C11.1956 19.8172 11.7505 19.8223 12.3055 19.8286C13.3004 19.8389 14.3096 19.8494 15.3242 19.8494C16.6913 19.8494 18.0681 19.8304 19.4318 19.7665C19.7275 19.7582 20.0224 19.7308 20.3146 19.6843C20.7798 19.6016 21.0412 19.3159 21.0702 18.8579C21.0815 18.6793 21.0961 18.4863 21.111 18.2913C21.1311 18.0268 21.152 17.7534 21.1649 17.5034C21.1555 15.7706 20.9816 12.8062 20.9482 12.5736C20.9439 12.5273 20.9295 12.4824 20.906 12.4422C20.8825 12.402 20.8505 12.3672 20.8122 12.3406Z'
        fill='#FFFFFF'
      />
    </g>
    <defs>
      <clipPath id='clip0_2249_17820'>
        <rect width='18.84' height='17.52' fill='white' transform='translate(2.39844 2.39844)' />
      </clipPath>
    </defs>
  </svg>
)

export const DownArrow = () => (
  <svg width='6' height='21' viewBox='0 0 6 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M3 20.0439L0.113249 15.0439L5.88675 15.0439L3 20.0439ZM3.5 0.0439453L3.5 15.5439H2.5L2.5 0.0439453L3.5 0.0439453Z'
      fill='#25222C'
    />
  </svg>
)
export const RightArrow = () => (
  <svg width='41' height='7' viewBox='0 0 41 7' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      id='Arrow 4'
      d='M40.5 3.5L35.5 6.38675V0.613249L40.5 3.5ZM0.5 3L36 3V4L0.5 4L0.5 3Z'
      fill='#25222C'
    />
  </svg>
)

export const Hamburger = () => (
  <svg width='30' height='23' viewBox='0 0 30 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <line x1='0.5' y1='1' x2='29.5' y2='1' stroke='black' />
    <line x1='0.5' y1='8' x2='29.5' y2='8' stroke='black' />
    <line x1='0.5' y1='15' x2='29.5' y2='15' stroke='black' />
    <line x1='0.5' y1='22' x2='29.5' y2='22' stroke='black' />
  </svg>
)

export const GoogleLogo = () => (
  <svg width='25' height='24' viewBox='0 0 25 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g id='Google Logo'>
      <g id='logo googleg 48dp'>
        <path
          id='Shape'
          fillRule='evenodd'
          clipRule='evenodd'
          d='M23.54 12.2585C23.54 11.4431 23.4668 10.659 23.3309 9.90625H12.5V14.3547H18.6891C18.4225 15.7922 17.6123 17.0101 16.3943 17.8256V20.711H20.1109C22.2855 18.709 23.54 15.7608 23.54 12.2585Z'
          fill='#4285F4'
        />
        <path
          id='Shape_2'
          fillRule='evenodd'
          clipRule='evenodd'
          d='M12.4995 23.5025C15.6045 23.5025 18.2077 22.4727 20.1104 20.7164L16.3938 17.8309C15.364 18.5209 14.0467 18.9286 12.4995 18.9286C9.50425 18.9286 6.96902 16.9057 6.0647 14.1875H2.22266V17.167C4.11493 20.9255 8.00402 23.5025 12.4995 23.5025Z'
          fill='#34A853'
        />
        <path
          id='Shape_3'
          fillRule='evenodd'
          clipRule='evenodd'
          d='M6.06523 14.1855C5.83523 13.4955 5.70455 12.7584 5.70455 12.0005C5.70455 11.2425 5.83523 10.5055 6.06523 9.81548V6.83594H2.22318C1.44432 8.38844 1 10.1448 1 12.0005C1 13.8562 1.44432 15.6125 2.22318 17.165L6.06523 14.1855Z'
          fill='#FBBC05'
        />
        <path
          id='Shape_4'
          fillRule='evenodd'
          clipRule='evenodd'
          d='M12.4995 5.07386C14.1879 5.07386 15.7038 5.65409 16.8956 6.79364L20.194 3.49523C18.2024 1.63955 15.5992 0.5 12.4995 0.5C8.00402 0.5 4.11493 3.07705 2.22266 6.83545L6.0647 9.815C6.96902 7.09682 9.50425 5.07386 12.4995 5.07386Z'
          fill='#EA4335'
        />
      </g>
    </g>
  </svg>
)

export const AppleLogo = () => (
  <svg width='25' height='28' viewBox='0 0 25 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g id='Apple Logo'>
      <path
        id='path4'
        d='M21.7798 18.424C21.432 19.2275 21.0203 19.9672 20.5433 20.6472C19.893 21.5743 19.3606 22.216 18.9503 22.5724C18.3143 23.1573 17.6329 23.4568 16.9031 23.4739C16.3792 23.4739 15.7475 23.3248 15.0121 23.0224C14.2742 22.7214 13.5962 22.5724 12.9762 22.5724C12.326 22.5724 11.6286 22.7214 10.8827 23.0224C10.1356 23.3248 9.53383 23.4824 9.0737 23.498C8.37393 23.5278 7.67643 23.2197 6.9802 22.5724C6.53583 22.1848 5.98002 21.5204 5.31417 20.5791C4.59977 19.5739 4.01244 18.4084 3.55231 17.0795C3.05953 15.6442 2.8125 14.2543 2.8125 12.9087C2.8125 11.3673 3.14556 10.0379 3.81269 8.92385C4.33698 8.029 5.03449 7.32312 5.90747 6.80493C6.78045 6.28674 7.7237 6.02267 8.73951 6.00578C9.29532 6.00578 10.0242 6.1777 10.93 6.51559C11.8332 6.85462 12.4131 7.02655 12.6674 7.02655C12.8575 7.02655 13.5018 6.82552 14.594 6.42473C15.6268 6.05305 16.4985 5.89916 17.2126 5.95978C19.1477 6.11595 20.6015 6.87876 21.5683 8.25303C19.8377 9.30163 18.9816 10.7703 18.9986 12.6544C19.0142 14.122 19.5466 15.3432 20.5929 16.3129C21.0671 16.7629 21.5967 17.1107 22.1859 17.3578C22.0581 17.7283 21.9232 18.0832 21.7798 18.424ZM17.3418 0.960131C17.3418 2.11039 16.9216 3.18439 16.0839 4.17847C15.0731 5.36023 13.8505 6.04311 12.5246 5.93536C12.5077 5.79736 12.4979 5.65213 12.4979 5.49951C12.4979 4.39526 12.9786 3.21349 13.8323 2.24724C14.2585 1.75801 14.8005 1.35122 15.4579 1.02671C16.1138 0.707053 16.7342 0.530273 17.3177 0.5C17.3347 0.653772 17.3418 0.807554 17.3418 0.960116V0.960131Z'
        fill='#343434'
      />
    </g>
  </svg>
)

export const UnhideIcon = () => (
  <svg width='25' height='15' viewBox='0 0 25 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g clipPath='url(#clip0_3324_29664)'>
      <path
        d='M12.6763 0.619399C14.8323 0.679998 16.8953 1.15623 18.8127 2.15564C20.2216 2.88443 21.5135 3.82178 22.6454 4.93639C22.982 5.28821 23.2995 5.65802 23.5965 6.04422C23.9632 6.49521 24.0248 7.05266 24.0496 7.60025C24.046 7.84464 23.9749 8.08322 23.8442 8.28934C22.595 10.3797 20.9596 12.0508 18.7208 13.0842C15.5542 14.5459 12.3079 14.8827 8.95864 13.8366C6.50176 13.069 4.20609 11.9737 2.18604 10.3416C1.612 9.87778 1.09293 9.3664 0.730752 8.71719C0.590386 8.44752 0.467289 8.16912 0.362217 7.88367C0.238436 7.57471 0.314443 7.27484 0.476742 7.00879C0.609483 6.80405 0.762223 6.61313 0.932709 6.4389C2.13402 5.13919 3.47335 3.97575 4.92676 2.96938C6.28401 2.03223 7.81298 1.37559 9.42483 1.03764C10.4908 0.809683 11.5672 0.571882 12.6763 0.619399ZM1.75564 7.7209C2.11834 8.34667 2.66843 8.73017 3.21966 9.10967C5.1431 10.434 7.25115 11.3489 9.49721 11.9541C11.8604 12.5909 14.1819 12.4041 16.4826 11.6206C18.8026 10.8302 20.6138 9.34599 22.1693 7.49809C22.214 7.45619 22.2457 7.40212 22.2605 7.34246C22.2663 7.22733 22.2888 7.07307 22.2274 7.0019C21.5112 6.17193 20.7795 5.35452 19.8642 4.73534C15.655 1.88949 11.2507 1.71836 6.73299 3.8679C4.96935 4.70697 3.43777 5.92973 2.00664 7.26375C1.88286 7.37825 1.83383 7.57249 1.75513 7.7209H1.75564Z'
        fill='#6F6D73'
      />
      <path
        d='M15.5732 7.2404C15.5823 7.83169 15.3734 8.40545 14.9866 8.85103C14.1927 9.77048 13.214 10.3058 11.962 10.2264C11.5521 10.2072 11.1519 10.095 10.7914 9.89813C10.4309 9.70126 10.1194 9.42487 9.88025 9.08969C9.64114 8.7545 9.48062 8.36924 9.41077 7.96279C9.34091 7.55634 9.36353 7.13924 9.4769 6.74282C9.61053 6.27473 9.8201 5.83202 10.0972 5.43256C11.3346 3.68921 13.6203 3.96468 14.7491 5.01726C15.3684 5.59489 15.5859 6.33644 15.5732 7.2404ZM12.396 6.20487C11.8412 6.17515 11.3362 6.45669 11.2156 6.81118C11.0726 7.23202 11.0822 7.65055 11.3865 8.01184C11.4638 8.10393 11.5583 8.18002 11.6644 8.23583C11.8786 8.35272 12.1213 8.4061 12.3643 8.38979C12.6075 8.37348 12.8409 8.28816 13.0377 8.14372C13.7582 7.65861 13.7068 6.77046 12.9364 6.39588C12.7612 6.31889 12.5806 6.25506 12.396 6.20487Z'
        fill='#6F6D73'
      />
    </g>
    <defs>
      <clipPath id='clip0_3324_29664'>
        <rect width='23.84' height='13.92' fill='white' transform='translate(0.300781 0.601562)' />
      </clipPath>
    </defs>
  </svg>
)

export const HideIcon = () => (
  <svg width='25' height='24' viewBox='0 0 25 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g id='hide' clipPath='url(#clip0_2925_3247)'>
      <path
        id='Vector'
        d='M6.42612 5.85285C6.42612 5.52743 6.1923 5.31822 6.02521 5.07763C5.54112 4.3809 5.03768 3.69691 4.56921 2.98994C4.18714 2.44033 3.91854 1.82073 3.77897 1.16707C3.75723 1.04793 3.7643 0.925368 3.79966 0.809504C3.83501 0.693639 3.89766 0.587822 3.9823 0.500812C4.06408 0.412613 4.17064 0.350966 4.28816 0.323937C4.40567 0.296907 4.52864 0.305736 4.64104 0.349273C4.99 0.502559 5.23224 0.772996 5.46554 1.05005C6.40332 2.16365 7.33639 3.28124 8.26473 4.40285C9.1567 5.47574 10.0616 6.53851 10.9311 7.62891C11.8762 8.81387 12.7866 10.0261 13.7132 11.2256C13.9728 11.5615 14.2213 11.9075 14.5008 12.2265C15.7416 13.6429 16.8545 15.1575 17.9892 16.6569C18.4278 17.2363 18.9213 17.7744 19.3663 18.3492C20.4053 19.6913 21.4352 21.0402 22.4561 22.3959C22.6956 22.7144 22.5995 23.1824 22.3071 23.3608C22.172 23.4312 22.0186 23.4588 21.8673 23.4397C21.7162 23.4207 21.5745 23.3557 21.4615 23.254C21.2903 23.0833 21.1259 22.9052 20.9661 22.7238C19.6023 21.1763 18.2388 19.6284 16.8758 18.0803C16.7988 17.986 16.6979 17.9137 16.5835 17.8709C16.4691 17.828 16.3453 17.8162 16.2247 17.8366C15.8054 17.9061 15.3891 17.9934 14.9709 18.0705C12.6955 18.4903 10.4885 18.1784 8.32781 17.4339C6.42186 16.7772 4.6099 15.9257 2.97129 14.7437C2.47475 14.3945 2.00616 14.0076 1.56974 13.5865C1.23096 13.2403 0.93646 12.8539 0.692882 12.436C0.157159 11.5442 0.220434 11.1291 0.956143 10.3329C2.31971 8.8623 3.87257 7.57727 5.57437 6.51117C5.87721 6.32018 6.25164 6.21493 6.42612 5.85285ZM9.76311 9.6332C9.27642 8.8617 8.65388 8.20642 7.99552 7.58686C7.88569 7.48329 7.65299 7.46765 7.48257 7.48122C7.30251 7.50707 7.12926 7.56758 6.97247 7.65935C5.18707 8.58569 3.58231 9.76805 2.08101 11.0952C2.02238 11.1425 1.97399 11.2011 1.93873 11.2676C1.90348 11.334 1.88208 11.4068 1.87585 11.4817C1.86963 11.5566 1.87868 11.632 1.90249 11.7032C1.9263 11.7745 1.96435 11.8402 2.01437 11.8966C2.41711 12.3489 2.88191 12.7426 3.39503 13.066C5.1746 14.2496 7.11332 15.096 9.15846 15.6984C10.8085 16.184 12.4975 16.2709 14.2025 16.0526C14.331 16.0409 14.454 15.9957 14.5593 15.9215C14.6645 15.8472 14.7481 15.7467 14.8016 15.6299C14.6341 15.4086 14.4513 15.1711 14.2728 14.9305C13.819 14.3189 13.3104 13.8327 12.4482 14.0768C12.328 14.0932 12.2062 14.094 12.0858 14.0788C10.7956 14.0799 9.23334 13.0161 9.45675 11.0571C9.51037 10.5855 9.65463 10.1246 9.76311 9.6328V9.6332Z'
        fill='#6F6D73'
      />
      <path
        id='Vector_2'
        d='M19.5222 16.3883C19.082 16.1508 18.7957 15.7743 18.5378 15.3428C18.457 15.2106 18.4259 15.054 18.4498 14.901C18.4739 14.748 18.5515 14.6084 18.6691 14.5069C18.7207 14.4624 18.7758 14.4219 18.8339 14.3859C19.5073 13.9732 20.1305 13.4844 20.6909 12.929C22.8748 10.7776 22.7562 11.3047 20.6909 9.28207C19.4104 8.02885 17.7908 7.30842 16.0779 6.81873C15.0241 6.51755 13.9471 6.3308 12.8414 6.37337C12.5379 6.38517 12.2337 6.37833 11.93 6.38568C11.4707 6.39697 11.1097 6.1912 10.812 5.8693C10.6492 5.69322 10.5184 5.48784 10.3725 5.29623C10.2822 5.17744 10.3924 4.90774 10.5417 4.85844C11.7264 4.46704 12.9409 4.50929 14.151 4.65584C17.472 5.05811 20.2634 6.56156 22.6755 8.81051C23.0702 9.17839 23.3946 9.62612 23.7216 10.0593C23.9701 10.4083 24.1012 10.8266 24.0963 11.2543C24.1012 11.4893 24.094 11.7648 23.9799 11.9554C22.9132 13.7397 21.6822 15.3746 19.7399 16.3197C19.6689 16.3473 19.5962 16.3702 19.5222 16.3883Z'
        fill='#6F6D73'
      />
      <path
        id='Vector_3'
        d='M15.6975 10.8983C15.668 11.1327 15.4933 11.6597 15.406 11.5518C14.724 10.7129 13.6941 9.48504 13.0402 8.62395C13.0134 8.57867 12.9983 8.52743 12.9963 8.47489C12.9943 8.42235 13.0055 8.37015 13.0288 8.32297C13.0701 8.2821 13.12 8.2507 13.1748 8.23093C13.2295 8.21116 13.288 8.20351 13.346 8.20852C13.8854 8.29395 14.387 8.5368 14.7873 8.90629C15.4042 9.46807 15.7841 10.2108 15.6975 10.8983Z'
        fill='#47444F'
      />
    </g>
    <defs>
      <clipPath id='clip0_2925_3247'>
        <rect width='23.84' height='23.2' fill='white' transform='translate(0.300781 0.300781)' />
      </clipPath>
    </defs>
  </svg>
)

export const SearchIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g id='Search Icon'>
      <path
        id='Vector'
        d='M6.71548 14.883C8.02032 15.1088 9.32165 15.0071 10.6942 14.5719C11.4946 14.3242 12.2579 13.9685 12.9634 13.5148C13.0961 13.663 13.2275 13.8105 13.3576 13.9572C13.6769 14.3169 13.9791 14.6567 14.2951 14.9975C15.8396 16.6638 17.5151 18.2481 19.1355 19.7803C19.4301 20.0589 19.7245 20.3377 20.0187 20.6166C20.2494 20.8282 20.5027 21.0132 20.7741 21.1684C20.8411 21.2042 20.9163 21.2219 20.9921 21.2197C21.0715 21.2209 21.1502 21.2043 21.2224 21.1711C21.2615 21.1514 21.2963 21.1239 21.3246 21.0904C21.353 21.0568 21.3744 21.0179 21.3875 20.976C21.403 20.926 21.4086 20.8735 21.4039 20.8212C21.3992 20.7691 21.3843 20.7184 21.3601 20.672C21.2319 20.4024 21.0752 20.1474 20.8929 19.9115C20.5989 19.5609 20.2861 19.2266 19.956 18.9102C19.1871 18.1621 18.4022 17.4051 17.643 16.6729C17.1166 16.1654 16.5906 15.6574 16.065 15.149C15.5224 14.6236 14.9941 14.1075 14.4348 13.5603C14.207 13.3376 13.9777 13.1137 13.747 12.8885L13.7769 12.8555C13.8204 12.8077 13.8541 12.7706 13.89 12.7356C14.7643 11.8844 15.2436 10.8196 15.3147 9.57084C15.4382 7.40242 14.7112 5.56163 13.1542 4.09897C12.3914 3.36531 11.4018 2.9164 10.35 2.82692C9.32706 2.72798 8.29485 2.84588 7.32004 3.17302C5.82557 3.68404 4.55695 4.66441 3.5496 6.08698C2.68166 7.31261 2.33377 8.67254 2.51562 10.129C2.63422 11.0794 3.01676 11.98 3.75582 13.0493C4.45423 14.0593 5.42217 14.6592 6.71548 14.883ZM8.26096 4.29145C8.60861 4.26177 8.96809 4.23116 9.32111 4.21941C9.38092 4.21753 9.44016 4.21656 9.49882 4.21651C11.1079 4.21651 12.3444 4.95046 13.1759 6.39997C13.9201 7.69701 14.1306 8.94003 13.8196 10.2C13.713 10.6724 13.5002 11.1141 13.1974 11.4909C12.8216 11.9503 12.365 12.3361 11.8501 12.629C10.6747 13.2999 9.35262 13.6687 8.00139 13.7025C7.87181 13.6881 7.74191 13.6753 7.61201 13.6626C7.32573 13.6345 7.02964 13.6054 6.74281 13.5584C6.02987 13.4503 5.38204 13.0804 4.92437 12.5202C4.36661 11.866 3.96393 11.093 3.74671 10.2595C3.49759 9.29333 3.58838 8.27029 4.00371 7.36375C4.46739 6.32832 5.08324 5.56437 5.88655 5.0283C6.52935 4.59942 7.11538 4.37884 7.73061 4.33436C7.90747 4.3216 8.08402 4.30648 8.26065 4.29145H8.26096Z'
        fill='#969696'
      />
    </g>
  </svg>
)

export const RingIcon = () => (
  <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M5.26421 13.3515C5.09893 13.8474 4.82207 14.0971 4.65706 14.5081C4.61058 14.6708 4.28686 15.128 4.21401 15.2919C4.18121 15.3657 3.86566 15.8339 4.06633 15.8457C4.21544 15.8545 4.41242 15.879 4.52579 15.7883C4.58494 15.741 4.90404 15.7129 4.98935 15.694C5.212 15.6445 5.43055 15.5676 5.65804 15.5135C6.68374 15.2692 7.71834 15.0702 8.7512 14.8078C10.8708 14.2695 12.9501 13.5461 15.0278 12.8921C15.6428 12.6984 16.2964 12.8551 16.8779 12.5967C17.0901 12.5024 16.9999 12.3013 16.8041 12.3013C16.5214 12.3013 16.2356 12.1782 15.9918 12.047C15.1963 11.6186 15.0321 10.8749 14.5355 10.1599C14.1287 9.57405 13.8281 8.92645 13.4812 8.30973C13.0886 7.61178 12.9718 6.76998 12.6156 6.05755C12.3002 5.42676 11.8694 5.18394 11.3029 4.78582C10.646 4.32426 9.67394 4.55856 9.00965 4.84325C8.7928 4.93619 8.48976 4.99803 8.31636 5.17144C8.09553 5.39227 7.91413 5.6475 7.6928 5.86884C7.35275 6.20889 7.01676 6.70402 6.80259 7.13236C6.1632 8.41114 5.98331 9.82986 5.70726 11.2101C5.5661 11.9159 5.49027 12.6733 5.26421 13.3515Z'
      fill='#DBF8CA'
      stroke='#555555'
      strokeWidth='0.822066'
      strokeLinecap='round'
    />
    <path
      d='M9.21815 3.51616C8.99518 3.88102 9.01304 4.10482 9.01304 4.54995L10.5757 4.23237C10.5757 4.23237 10.6064 2.99927 10.2314 2.99927C9.84444 2.99927 9.42718 3.17412 9.21815 3.51616Z'
      stroke='#555555'
      strokeWidth='0.822066'
      strokeLinecap='round'
    />
    <path
      d='M9.6929 15.763C9.34382 15.3302 9.34382 15.3302 9.02832 14.8194L11.982 13.8595C12.2211 14.0971 12.2211 14.5082 12.2035 14.7866C12.2211 15.3302 10.988 16.1523 10.5769 16.1523C10.1659 16.1523 10.1659 16.1523 9.6929 15.763Z'
      stroke='#555555'
      strokeWidth='0.822066'
      strokeLinecap='round'
    />
  </svg>
)

export const SharingRadioIcon = ({ checked = false }: { checked: boolean }) =>
  checked ? (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M18.5 9.5C18.5 13.9183 14.9183 17.5 10.5 17.5C6.08172 17.5 2.5 14.4183 2.5 10C2.5 5.58172 5.58172 2.5 10 2.5C14.4183 2.5 18.5 5 18.5 9.5Z'
        fill='#C1B9CF'
      />
      <path
        d='M16.1356 4.95902C16.1746 4.92414 16.2058 4.88133 16.2269 4.83345C16.2481 4.78556 16.2588 4.7337 16.2582 4.68135C16.2577 4.629 16.246 4.57736 16.2239 4.5299C16.2018 4.48244 16.1698 4.44025 16.1301 4.40615C16.0883 4.37026 16.0467 4.33455 16.0056 4.29904C15.6911 4.0287 15.3661 3.74879 15.026 3.51002C12.4283 1.68173 9.72919 1.67144 7.00406 2.64106C4.53671 3.51832 2.95222 5.27341 2.29394 7.8566C1.55961 10.7427 2.20265 13.2888 4.2065 15.4251C4.25864 15.4803 4.31184 15.5354 4.36497 15.5882C5.44142 16.6647 6.78217 17.3293 7.8445 17.7917C8.30048 17.9909 10.6401 18.2327 11.2731 18.1383C15.035 17.5766 17.5107 15.4548 18.3729 11.905C18.5375 11.2097 18.6195 10.4974 18.6171 9.78285C18.6134 9.03243 18.4872 8.28765 18.2435 7.57789C18.2258 7.5248 18.1965 7.47628 18.1578 7.43582C18.1191 7.39536 18.072 7.36395 18.0197 7.34384C17.9675 7.32373 17.9115 7.31541 17.8556 7.31949C17.7998 7.32356 17.7456 7.33994 17.6968 7.36742L17.6866 7.37324C17.6091 7.41761 17.5497 7.48782 17.5187 7.57158C17.4878 7.65534 17.4873 7.74731 17.5173 7.83141C17.7372 8.44149 17.8494 9.08518 17.8487 9.73369C17.8411 10.5117 17.7358 11.2857 17.5352 12.0375C16.9408 14.1978 15.5199 15.7723 13.191 16.8492C10.8234 17.9828 7.42818 16.8368 6.52482 16.2404C5.52634 15.5578 4.65266 14.7086 3.94198 13.7298C2.82745 12.1518 2.5774 9.88365 3.17631 7.81006C3.45657 6.85266 3.94639 5.96962 4.61024 5.22499C5.27409 4.48036 6.09533 3.8928 7.01441 3.50491C9.40544 2.51125 11.8045 2.33597 14.1445 3.82412C14.4582 4.02388 15.2582 4.65201 15.6625 4.97278C15.7303 5.02659 15.815 5.05468 15.9016 5.05209C15.9881 5.04949 16.0711 5.0168 16.1356 4.95902Z'
        fill='#555555'
      />
      <path
        d='M9.38031 12.3504C9.54055 12.1981 9.62858 12.1211 9.70917 12.0369C12.2927 9.33769 15.1221 6.90765 17.9683 4.49641C18.0758 4.40533 18.1859 4.28914 18.3132 4.25651C18.4667 4.21729 18.7171 4.26241 18.7856 4.34575C18.8307 4.40735 18.8592 4.47949 18.8684 4.55526C18.8775 4.63103 18.8671 4.70789 18.838 4.77846C18.7711 4.95388 18.6082 5.10413 18.4603 5.23543C17.5781 6.01934 16.6713 6.77622 15.8047 7.5763C13.9931 9.24938 12.193 10.9349 10.4045 12.6329C9.62078 13.3753 9.31916 13.4053 8.59803 12.6121C8.12333 12.0896 6.69072 10.3289 6.25198 9.77409C6.19 9.68786 6.13479 9.59695 6.08684 9.50219C5.98789 9.3267 5.9232 9.13333 6.1199 8.99728C6.33902 8.84576 6.49451 9.00387 6.62439 9.16851C6.75584 9.33521 6.86792 9.5183 7.00865 9.67627C7.44554 10.1665 8.90823 11.8334 9.38031 12.3504Z'
        fill='#555555'
      />
    </svg>
  ) : (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M16.1356 4.95902C16.1746 4.92414 16.2058 4.88133 16.2269 4.83345C16.2481 4.78556 16.2588 4.7337 16.2582 4.68135C16.2577 4.629 16.246 4.57736 16.2239 4.5299C16.2018 4.48244 16.1698 4.44025 16.1301 4.40615C16.0883 4.37026 16.0467 4.33455 16.0056 4.29904C15.6911 4.0287 15.3661 3.74879 15.026 3.51002C12.4283 1.68173 9.72919 1.67144 7.00406 2.64106C4.53671 3.51832 2.95222 5.27341 2.29394 7.8566C1.55961 10.7427 2.20265 13.2888 4.2065 15.4251C4.25864 15.4802 4.31184 15.5354 4.36497 15.5882C5.44142 16.6647 6.78217 17.3293 7.8445 17.7917C8.30048 17.9909 10.6401 18.2327 11.2731 18.1383C15.035 17.5766 17.5107 15.4548 18.3729 11.905C18.5375 11.2097 18.6195 10.4974 18.6171 9.78285C18.6134 9.03243 18.4872 8.28765 18.2435 7.57789C18.2258 7.5248 18.1965 7.47628 18.1578 7.43582C18.1191 7.39536 18.072 7.36395 18.0197 7.34384C17.9675 7.32373 17.9115 7.31541 17.8556 7.31949C17.7998 7.32356 17.7456 7.33994 17.6968 7.36742L17.6866 7.37324C17.6091 7.41761 17.5497 7.48782 17.5187 7.57158C17.4878 7.65534 17.4873 7.74731 17.5173 7.83141C17.7372 8.44149 17.8494 9.08518 17.8487 9.73369C17.8411 10.5117 17.7358 11.2857 17.5352 12.0375C16.9408 14.1978 15.5199 15.7723 13.191 16.8492C10.8234 17.9828 7.42818 16.8368 6.52482 16.2404C5.52634 15.5578 4.65266 14.7086 3.94198 13.7298C2.82745 12.1518 2.5774 9.88365 3.17631 7.81006C3.45657 6.85266 3.94639 5.96962 4.61024 5.22499C5.27409 4.48036 6.09533 3.8928 7.01441 3.50491C9.40544 2.51125 11.8045 2.33597 14.1445 3.82412C14.4582 4.02388 15.2582 4.65201 15.6625 4.97278C15.7303 5.02659 15.815 5.05468 15.9016 5.05209C15.9881 5.04949 16.071 5.01638 16.1354 4.9586L16.1356 4.95902Z'
        fill='#555555'
      />
    </svg>
  )
