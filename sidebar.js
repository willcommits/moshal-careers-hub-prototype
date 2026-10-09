/*
 * <moshal-sidebar>: the app's navigation panel as one self-contained component.
 *
 * Mechanics borrowed from the Nebula helpdesk sidebar:
 *  - two modes, full (240px) and rail (56px); the panel animates its width, the content never reflows mid-fold
 *  - sections with eyebrow labels in full mode; one icon per section in rail mode with a labelled flyout on hover
 *  - a single raised "indicator" card that glides between rows instead of each row toggling its own background
 *  - mode persists in localStorage, Ctrl+B toggles, Escape closes a flyout
 *
 * Usage:
 *   <moshal-sidebar sections='[...]' active="opps"></moshal-sidebar>
 *   el.addEventListener('navigate', e => e.detail.key)
 *   el.addEventListener('modechange', e => e.detail.rail)
 */
const LOGO_FULL = `<svg class="logo" role="img" aria-label="Moshal Program" viewBox="0 0 183 34" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#c0f)"><path d="M44.7561 15.0415H46.7892V16.2722H46.8275C47.138 15.7989 47.5668 15.415 48.0715 15.1588C48.5762 14.9025 49.1392 14.7827 49.7045 14.8113C51.1302 14.8113 52.1307 15.4698 52.6454 16.5215C52.9646 15.9824 53.423 15.5392 53.9725 15.2383C54.522 14.9373 55.1424 14.7899 55.7685 14.8113C58.1052 14.8113 59.2272 16.3457 59.2272 18.6824V24.3181H57.0887V19.2706C57.0887 17.7906 56.606 16.7133 55.2315 16.7133C53.8569 16.7133 53.0929 17.7107 53.0929 19.1907V24.3053H50.9703V19.2514C50.9703 17.7522 50.4173 16.7197 49.0524 16.7197C47.6874 16.7197 46.9138 17.7522 46.9138 19.2514V24.3181H44.7721L44.7561 15.0415Z" fill="currentColor"/><path d="M68.5862 19.6798C68.5862 17.9664 67.445 16.6845 65.8403 16.6845C64.2356 16.6845 63.0752 17.9632 63.0752 19.6798C63.0752 21.3964 64.1972 22.675 65.8403 22.675C67.4833 22.675 68.5862 21.374 68.5862 19.6798ZM60.9143 19.6798C60.9054 18.702 61.1874 17.7436 61.7243 16.9264C62.2613 16.1092 63.0291 15.47 63.9301 15.0901C64.8311 14.7102 65.8247 14.6067 66.7847 14.7927C67.7447 14.9787 68.6278 15.4458 69.3217 16.1348C70.0156 16.8237 70.4891 17.7034 70.6819 18.662C70.8748 19.6207 70.7784 20.615 70.405 21.5187C70.0316 22.4224 69.3979 23.1948 68.5846 23.7376C67.7712 24.2804 66.8149 24.5693 65.8371 24.5674C65.1902 24.5799 64.5473 24.4622 63.9467 24.2215C63.3461 23.9807 62.8001 23.6217 62.3409 23.1658C61.8817 22.7099 61.5188 22.1664 61.2737 21.5676C61.0287 20.9687 60.9064 20.3268 60.9143 19.6798" fill="currentColor"/><path d="M71.7376 22.8892L72.898 21.5881C73.1885 21.9865 73.5696 22.3102 74.0098 22.5325C74.4499 22.7548 74.9366 22.8694 75.4297 22.8668C76.427 22.8668 77.0696 22.4384 77.0696 21.7096C77.0696 20.8146 76.053 20.6036 75.0205 20.2807C73.63 19.8524 72.2714 19.1395 72.2714 17.5348C72.2714 15.8758 73.7706 14.8049 75.8389 14.8049C77.4372 14.8049 78.4793 15.4442 79.0355 16.0548L77.9135 17.391C77.6636 17.0978 77.3514 16.8641 76.9996 16.707C76.6479 16.55 76.2655 16.4735 75.8804 16.4831C74.9694 16.4831 74.4355 16.8571 74.4355 17.4101C74.4355 18.1773 75.3945 18.4075 76.2352 18.6888C77.6993 19.1523 79.2337 19.7948 79.2337 21.5658C79.2337 23.3367 77.6801 24.561 75.4521 24.561C73.6332 24.561 72.3833 23.7778 71.7408 22.9019" fill="currentColor"/><path d="M80.9917 11.474H83.1334V16.1666H83.1686C83.4994 15.7315 83.9292 15.3816 84.4223 15.1458C84.9154 14.9101 85.4577 14.7954 86.004 14.8113C88.3407 14.8113 89.5555 16.2913 89.5555 18.6984V24.318H87.4137V19.1811C87.4137 17.6818 86.8064 16.7357 85.3998 16.7357C83.9358 16.7357 83.1334 17.6946 83.1334 19.2162V24.3308H80.9917V11.474Z" fill="currentColor"/><path d="M98.9899 19.6798C98.9899 17.9856 97.8487 16.6845 96.2056 16.6845C94.5626 16.6845 93.4214 17.992 93.4214 19.6798C93.4214 21.3676 94.5626 22.6942 96.2024 22.6942C97.8423 22.6942 98.9867 21.374 98.9867 19.6798H98.9899ZM91.2093 19.6606C91.2093 16.8987 93.1528 14.7921 95.7581 14.7921C97.1838 14.7921 98.3442 15.4538 98.8972 16.2913H98.9323V15.0415H101.055V24.3117H99.0378V22.9371H99.0027C98.4688 23.8482 97.203 24.561 95.7581 24.561C93.2008 24.561 91.2093 22.4544 91.2093 19.6542" fill="currentColor"/><path d="M105.713 10.9402H103.591V24.3181H105.713V10.9402Z" fill="currentColor"/><path d="M120.55 19.8588C120.55 17.6819 118.999 16.042 117.001 16.042C115.003 16.042 113.434 17.7011 113.434 19.8396C113.434 21.9782 114.968 23.6564 117.001 23.6564C119.034 23.6564 120.55 21.9814 120.55 19.8588ZM112.453 15.3643H113.453V17.3526H113.488C114.096 15.9589 115.592 15.115 117.161 15.115C119.661 15.115 121.636 17.1832 121.636 19.8588C121.636 22.48 119.718 24.5674 117.196 24.5674C115.572 24.5674 114.128 23.6756 113.539 22.3905V27.633H112.485L112.453 15.3643Z" fill="currentColor"/><path d="M123.789 15.3643H124.79V17.0745H124.825C125.288 15.8278 126.126 15.115 127.382 15.115C127.629 15.112 127.875 15.141 128.114 15.2013V16.2018C127.839 16.1343 127.557 16.0989 127.273 16.0964C125.634 16.0964 124.85 17.5572 124.85 19.293V24.3245H123.789V15.3643Z" fill="currentColor"/><path d="M137.331 19.8236C137.331 17.6818 135.816 16.042 133.783 16.042C131.75 16.042 130.267 17.6818 130.267 19.8236C130.267 21.9653 131.766 23.6595 133.783 23.6595C135.8 23.6595 137.331 21.9845 137.331 19.8236ZM129.164 19.8236C129.183 18.9122 129.472 18.0268 129.992 17.2786C130.513 16.5303 131.243 15.9525 132.091 15.6176C132.939 15.2827 133.867 15.2056 134.758 15.396C135.65 15.5865 136.465 16.0359 137.102 16.6879C137.739 17.34 138.17 18.1657 138.339 19.0614C138.509 19.9571 138.41 20.8829 138.056 21.7228C137.701 22.5626 137.107 23.2791 136.347 23.7823C135.586 24.2855 134.695 24.5531 133.783 24.5514C133.166 24.5542 132.555 24.433 131.987 24.195C131.418 23.957 130.903 23.6071 130.472 23.1661C130.041 22.725 129.703 22.2019 129.478 21.6277C129.254 21.0535 129.147 20.4399 129.164 19.8236Z" fill="currentColor"/><path d="M148.032 19.8588C148.032 17.7011 146.463 16.042 144.465 16.042C142.467 16.042 140.914 17.6819 140.914 19.8588C140.914 22.0357 142.448 23.6564 144.465 23.6564C146.482 23.6564 148.032 21.9813 148.032 19.8588ZM140.933 26.3863L141.61 25.7789C142.25 26.5813 143.34 27.0288 144.641 27.0288C146.763 27.0288 148.013 25.8684 148.013 23.8705V22.3202H147.978C147.406 23.6755 145.926 24.5578 144.321 24.5578C141.789 24.5578 139.846 22.4704 139.846 19.814C139.846 17.1576 141.793 15.1054 144.289 15.1054C145.887 15.1054 147.339 15.9429 147.946 17.2791H147.981V15.3611H149.043V23.7075C149.043 26.3479 147.508 27.844 144.708 27.844C143.033 27.844 141.674 27.3293 140.946 26.3831" fill="currentColor"/><path d="M151.936 15.3643H152.933V17.0745H152.969C153.435 15.8278 154.273 15.1149 155.526 15.1149C155.773 15.1118 156.019 15.1408 156.258 15.2013V16.2018C155.984 16.1343 155.703 16.0989 155.42 16.0963C153.78 16.0963 152.994 17.5572 152.994 19.2929V24.3244H151.942L151.936 15.3643Z" fill="currentColor"/><path d="M165.492 19.8396C165.492 17.7171 163.958 16.042 161.925 16.042C159.892 16.042 158.376 17.7011 158.376 19.8396C158.376 21.9782 159.927 23.6564 161.925 23.6564C163.923 23.6564 165.492 21.9973 165.492 19.8396ZM157.306 19.8396C157.306 17.1992 159.224 15.115 161.746 15.115C163.37 15.115 164.834 16.0068 165.403 17.3079H165.438V15.3643H166.493V24.3149H165.476V22.333H165.438C164.834 23.7267 163.354 24.5706 161.765 24.5706C159.284 24.5706 157.29 22.5184 157.29 19.8428" fill="currentColor"/><path d="M169.391 15.3643H170.392V16.8092H170.427C170.731 16.2749 171.176 15.8353 171.715 15.5391C172.253 15.2428 172.863 15.1015 173.477 15.1309C174.906 15.1309 175.973 15.7703 176.437 17.0937C176.722 16.4848 177.18 15.9736 177.755 15.6244C178.329 15.2752 178.994 15.1035 179.665 15.1309C181.842 15.1309 183.003 16.5215 183.003 18.9669V24.3181H181.967V19.1811C181.967 17.148 181.161 16.0228 179.576 16.0228C177.917 16.0228 176.776 17.1288 176.776 19.0212V24.3181H175.724V19.1619C175.724 17.1097 174.832 16.0228 173.263 16.0228C171.584 16.0228 170.462 17.1832 170.462 19.1811V24.3181H169.407L169.391 15.3643Z" fill="currentColor"/></g><g clip-path="url(#c1f)"><path d="M29.5469 32.8574H27.9223V6.6755L29.9226 4.66718C29.968 4.62231 30.0041 4.56886 30.0287 4.50992C30.0533 4.45099 30.066 4.38775 30.066 4.32388C30.066 4.26 30.0533 4.19676 30.0287 4.13783C30.0041 4.0789 29.968 4.02544 29.9226 3.98058V3.98058C29.8781 3.93599 29.8253 3.90062 29.7672 3.87649C29.709 3.85236 29.6467 3.83994 29.5838 3.83994C29.5208 3.83994 29.4585 3.85236 29.4004 3.87649C29.3422 3.90062 29.2894 3.93599 29.245 3.98058L23.4004 9.85104C23.3605 9.89059 23.329 9.93766 23.3075 9.98952C23.286 10.0414 23.275 10.097 23.2751 10.1531V33.5663C23.2751 33.5944 23.2807 33.6222 23.2915 33.6482C23.3023 33.6741 23.3181 33.6976 23.3381 33.7174C23.358 33.7372 23.3816 33.7529 23.4077 33.7635C23.4337 33.7741 23.4615 33.7794 23.4896 33.7792H29.5726C29.6352 33.7793 29.6972 33.7666 29.7547 33.7419C29.8122 33.7171 29.8641 33.6809 29.9071 33.6355C29.9502 33.59 29.9835 33.5362 30.005 33.4774C30.0266 33.4185 30.0359 33.3559 30.0324 33.2934C30.0219 33.1726 29.9659 33.0603 29.8758 32.9793C29.7856 32.8984 29.668 32.8548 29.5469 32.8574Z" fill="currentColor"/><path d="M0.64126 32.8575H2.26581V6.67557L0.263856 4.66725C0.21842 4.62238 0.182351 4.56893 0.157728 4.51C0.133105 4.45106 0.120422 4.38783 0.120422 4.32395C0.120422 4.26008 0.133105 4.19684 0.157728 4.13791C0.182351 4.07897 0.21842 4.02552 0.263856 3.98065V3.98065C0.308578 3.93498 0.361967 3.89869 0.42088 3.87392C0.479793 3.84915 0.543046 3.8364 0.606949 3.8364C0.670851 3.8364 0.734115 3.84915 0.793028 3.87392C0.851941 3.89869 0.905319 3.93498 0.950041 3.98065L6.79291 9.83909C6.83273 9.87865 6.86432 9.92572 6.88581 9.97758C6.90731 10.0294 6.9183 10.0851 6.91815 10.1412V33.5544C6.91994 33.5847 6.91523 33.615 6.90436 33.6433C6.89348 33.6717 6.87668 33.6973 6.85507 33.7186C6.83346 33.7399 6.80755 33.7563 6.77908 33.7668C6.75061 33.7773 6.72023 33.7815 6.68999 33.7792H0.613817C0.551215 33.7793 0.489252 33.7666 0.431727 33.7419C0.374202 33.7172 0.322324 33.681 0.279279 33.6355C0.236233 33.5901 0.202922 33.5362 0.181391 33.4774C0.159861 33.4186 0.15057 33.356 0.154074 33.2935C0.164918 33.1725 0.221259 33.0602 0.311705 32.9793C0.402152 32.8984 0.519946 32.8548 0.64126 32.8575V32.8575Z" fill="currentColor"/><path d="M15.0945 18.1504L13.1354 16.1919C13.1055 16.1622 13.0674 16.1419 13.0259 16.1338C12.9845 16.1256 12.9416 16.1298 12.9026 16.146C12.8636 16.1621 12.8302 16.1894 12.8066 16.2244C12.783 16.2595 12.7703 16.3007 12.7701 16.3429V33.5664C12.77 33.5945 12.7756 33.6223 12.7864 33.6482C12.7972 33.6742 12.813 33.6977 12.833 33.7175C12.8529 33.7373 12.8765 33.7529 12.9026 33.7635C12.9286 33.7741 12.9564 33.7795 12.9845 33.7792H17.2028C17.2309 33.7795 17.2587 33.7741 17.2847 33.7635C17.3107 33.7529 17.3344 33.7373 17.3543 33.7175C17.3743 33.6977 17.3901 33.6742 17.4009 33.6482C17.4117 33.6223 17.4172 33.5945 17.4172 33.5664V16.3395C17.417 16.2973 17.4043 16.256 17.3807 16.221C17.3571 16.186 17.3237 16.1587 17.2847 16.1425C17.2457 16.1264 17.2028 16.1222 17.1613 16.1303C17.1199 16.1385 17.0818 16.1587 17.0518 16.1885L15.0945 18.1504Z" fill="currentColor"/><path d="M15.0928 7.70372C17.2188 7.70372 18.9423 5.97919 18.9423 3.85188C18.9423 1.72456 17.2188 3.05176e-05 15.0928 3.05176e-05C12.9667 3.05176e-05 11.2433 1.72456 11.2433 3.85188C11.2433 5.97919 12.9667 7.70372 15.0928 7.70372Z" fill="currentColor"/></g><defs><clipPath id="c0f"><rect width="138.245" height="16.907" fill="white" transform="translate(44.7555 10.9402)"/></clipPath><clipPath id="c1f"><rect width="30.1922" height="33.8152" fill="white"/></clipPath></defs></svg>`;
const LOGO_MARK = `<svg class="mark" aria-hidden="true" viewBox="0 0 30.2 33.82" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#c0m)"><path d="M44.7561 15.0415H46.7892V16.2722H46.8275C47.138 15.7989 47.5668 15.415 48.0715 15.1588C48.5762 14.9025 49.1392 14.7827 49.7045 14.8113C51.1302 14.8113 52.1307 15.4698 52.6454 16.5215C52.9646 15.9824 53.423 15.5392 53.9725 15.2383C54.522 14.9373 55.1424 14.7899 55.7685 14.8113C58.1052 14.8113 59.2272 16.3457 59.2272 18.6824V24.3181H57.0887V19.2706C57.0887 17.7906 56.606 16.7133 55.2315 16.7133C53.8569 16.7133 53.0929 17.7107 53.0929 19.1907V24.3053H50.9703V19.2514C50.9703 17.7522 50.4173 16.7197 49.0524 16.7197C47.6874 16.7197 46.9138 17.7522 46.9138 19.2514V24.3181H44.7721L44.7561 15.0415Z" fill="currentColor"/><path d="M68.5862 19.6798C68.5862 17.9664 67.445 16.6845 65.8403 16.6845C64.2356 16.6845 63.0752 17.9632 63.0752 19.6798C63.0752 21.3964 64.1972 22.675 65.8403 22.675C67.4833 22.675 68.5862 21.374 68.5862 19.6798ZM60.9143 19.6798C60.9054 18.702 61.1874 17.7436 61.7243 16.9264C62.2613 16.1092 63.0291 15.47 63.9301 15.0901C64.8311 14.7102 65.8247 14.6067 66.7847 14.7927C67.7447 14.9787 68.6278 15.4458 69.3217 16.1348C70.0156 16.8237 70.4891 17.7034 70.6819 18.662C70.8748 19.6207 70.7784 20.615 70.405 21.5187C70.0316 22.4224 69.3979 23.1948 68.5846 23.7376C67.7712 24.2804 66.8149 24.5693 65.8371 24.5674C65.1902 24.5799 64.5473 24.4622 63.9467 24.2215C63.3461 23.9807 62.8001 23.6217 62.3409 23.1658C61.8817 22.7099 61.5188 22.1664 61.2737 21.5676C61.0287 20.9687 60.9064 20.3268 60.9143 19.6798" fill="currentColor"/><path d="M71.7376 22.8892L72.898 21.5881C73.1885 21.9865 73.5696 22.3102 74.0098 22.5325C74.4499 22.7548 74.9366 22.8694 75.4297 22.8668C76.427 22.8668 77.0696 22.4384 77.0696 21.7096C77.0696 20.8146 76.053 20.6036 75.0205 20.2807C73.63 19.8524 72.2714 19.1395 72.2714 17.5348C72.2714 15.8758 73.7706 14.8049 75.8389 14.8049C77.4372 14.8049 78.4793 15.4442 79.0355 16.0548L77.9135 17.391C77.6636 17.0978 77.3514 16.8641 76.9996 16.707C76.6479 16.55 76.2655 16.4735 75.8804 16.4831C74.9694 16.4831 74.4355 16.8571 74.4355 17.4101C74.4355 18.1773 75.3945 18.4075 76.2352 18.6888C77.6993 19.1523 79.2337 19.7948 79.2337 21.5658C79.2337 23.3367 77.6801 24.561 75.4521 24.561C73.6332 24.561 72.3833 23.7778 71.7408 22.9019" fill="currentColor"/><path d="M80.9917 11.474H83.1334V16.1666H83.1686C83.4994 15.7315 83.9292 15.3816 84.4223 15.1458C84.9154 14.9101 85.4577 14.7954 86.004 14.8113C88.3407 14.8113 89.5555 16.2913 89.5555 18.6984V24.318H87.4137V19.1811C87.4137 17.6818 86.8064 16.7357 85.3998 16.7357C83.9358 16.7357 83.1334 17.6946 83.1334 19.2162V24.3308H80.9917V11.474Z" fill="currentColor"/><path d="M98.9899 19.6798C98.9899 17.9856 97.8487 16.6845 96.2056 16.6845C94.5626 16.6845 93.4214 17.992 93.4214 19.6798C93.4214 21.3676 94.5626 22.6942 96.2024 22.6942C97.8423 22.6942 98.9867 21.374 98.9867 19.6798H98.9899ZM91.2093 19.6606C91.2093 16.8987 93.1528 14.7921 95.7581 14.7921C97.1838 14.7921 98.3442 15.4538 98.8972 16.2913H98.9323V15.0415H101.055V24.3117H99.0378V22.9371H99.0027C98.4688 23.8482 97.203 24.561 95.7581 24.561C93.2008 24.561 91.2093 22.4544 91.2093 19.6542" fill="currentColor"/><path d="M105.713 10.9402H103.591V24.3181H105.713V10.9402Z" fill="currentColor"/><path d="M120.55 19.8588C120.55 17.6819 118.999 16.042 117.001 16.042C115.003 16.042 113.434 17.7011 113.434 19.8396C113.434 21.9782 114.968 23.6564 117.001 23.6564C119.034 23.6564 120.55 21.9814 120.55 19.8588ZM112.453 15.3643H113.453V17.3526H113.488C114.096 15.9589 115.592 15.115 117.161 15.115C119.661 15.115 121.636 17.1832 121.636 19.8588C121.636 22.48 119.718 24.5674 117.196 24.5674C115.572 24.5674 114.128 23.6756 113.539 22.3905V27.633H112.485L112.453 15.3643Z" fill="currentColor"/><path d="M123.789 15.3643H124.79V17.0745H124.825C125.288 15.8278 126.126 15.115 127.382 15.115C127.629 15.112 127.875 15.141 128.114 15.2013V16.2018C127.839 16.1343 127.557 16.0989 127.273 16.0964C125.634 16.0964 124.85 17.5572 124.85 19.293V24.3245H123.789V15.3643Z" fill="currentColor"/><path d="M137.331 19.8236C137.331 17.6818 135.816 16.042 133.783 16.042C131.75 16.042 130.267 17.6818 130.267 19.8236C130.267 21.9653 131.766 23.6595 133.783 23.6595C135.8 23.6595 137.331 21.9845 137.331 19.8236ZM129.164 19.8236C129.183 18.9122 129.472 18.0268 129.992 17.2786C130.513 16.5303 131.243 15.9525 132.091 15.6176C132.939 15.2827 133.867 15.2056 134.758 15.396C135.65 15.5865 136.465 16.0359 137.102 16.6879C137.739 17.34 138.17 18.1657 138.339 19.0614C138.509 19.9571 138.41 20.8829 138.056 21.7228C137.701 22.5626 137.107 23.2791 136.347 23.7823C135.586 24.2855 134.695 24.5531 133.783 24.5514C133.166 24.5542 132.555 24.433 131.987 24.195C131.418 23.957 130.903 23.6071 130.472 23.1661C130.041 22.725 129.703 22.2019 129.478 21.6277C129.254 21.0535 129.147 20.4399 129.164 19.8236Z" fill="currentColor"/><path d="M148.032 19.8588C148.032 17.7011 146.463 16.042 144.465 16.042C142.467 16.042 140.914 17.6819 140.914 19.8588C140.914 22.0357 142.448 23.6564 144.465 23.6564C146.482 23.6564 148.032 21.9813 148.032 19.8588ZM140.933 26.3863L141.61 25.7789C142.25 26.5813 143.34 27.0288 144.641 27.0288C146.763 27.0288 148.013 25.8684 148.013 23.8705V22.3202H147.978C147.406 23.6755 145.926 24.5578 144.321 24.5578C141.789 24.5578 139.846 22.4704 139.846 19.814C139.846 17.1576 141.793 15.1054 144.289 15.1054C145.887 15.1054 147.339 15.9429 147.946 17.2791H147.981V15.3611H149.043V23.7075C149.043 26.3479 147.508 27.844 144.708 27.844C143.033 27.844 141.674 27.3293 140.946 26.3831" fill="currentColor"/><path d="M151.936 15.3643H152.933V17.0745H152.969C153.435 15.8278 154.273 15.1149 155.526 15.1149C155.773 15.1118 156.019 15.1408 156.258 15.2013V16.2018C155.984 16.1343 155.703 16.0989 155.42 16.0963C153.78 16.0963 152.994 17.5572 152.994 19.2929V24.3244H151.942L151.936 15.3643Z" fill="currentColor"/><path d="M165.492 19.8396C165.492 17.7171 163.958 16.042 161.925 16.042C159.892 16.042 158.376 17.7011 158.376 19.8396C158.376 21.9782 159.927 23.6564 161.925 23.6564C163.923 23.6564 165.492 21.9973 165.492 19.8396ZM157.306 19.8396C157.306 17.1992 159.224 15.115 161.746 15.115C163.37 15.115 164.834 16.0068 165.403 17.3079H165.438V15.3643H166.493V24.3149H165.476V22.333H165.438C164.834 23.7267 163.354 24.5706 161.765 24.5706C159.284 24.5706 157.29 22.5184 157.29 19.8428" fill="currentColor"/><path d="M169.391 15.3643H170.392V16.8092H170.427C170.731 16.2749 171.176 15.8353 171.715 15.5391C172.253 15.2428 172.863 15.1015 173.477 15.1309C174.906 15.1309 175.973 15.7703 176.437 17.0937C176.722 16.4848 177.18 15.9736 177.755 15.6244C178.329 15.2752 178.994 15.1035 179.665 15.1309C181.842 15.1309 183.003 16.5215 183.003 18.9669V24.3181H181.967V19.1811C181.967 17.148 181.161 16.0228 179.576 16.0228C177.917 16.0228 176.776 17.1288 176.776 19.0212V24.3181H175.724V19.1619C175.724 17.1097 174.832 16.0228 173.263 16.0228C171.584 16.0228 170.462 17.1832 170.462 19.1811V24.3181H169.407L169.391 15.3643Z" fill="currentColor"/></g><g clip-path="url(#c1m)"><path d="M29.5469 32.8574H27.9223V6.6755L29.9226 4.66718C29.968 4.62231 30.0041 4.56886 30.0287 4.50992C30.0533 4.45099 30.066 4.38775 30.066 4.32388C30.066 4.26 30.0533 4.19676 30.0287 4.13783C30.0041 4.0789 29.968 4.02544 29.9226 3.98058V3.98058C29.8781 3.93599 29.8253 3.90062 29.7672 3.87649C29.709 3.85236 29.6467 3.83994 29.5838 3.83994C29.5208 3.83994 29.4585 3.85236 29.4004 3.87649C29.3422 3.90062 29.2894 3.93599 29.245 3.98058L23.4004 9.85104C23.3605 9.89059 23.329 9.93766 23.3075 9.98952C23.286 10.0414 23.275 10.097 23.2751 10.1531V33.5663C23.2751 33.5944 23.2807 33.6222 23.2915 33.6482C23.3023 33.6741 23.3181 33.6976 23.3381 33.7174C23.358 33.7372 23.3816 33.7529 23.4077 33.7635C23.4337 33.7741 23.4615 33.7794 23.4896 33.7792H29.5726C29.6352 33.7793 29.6972 33.7666 29.7547 33.7419C29.8122 33.7171 29.8641 33.6809 29.9071 33.6355C29.9502 33.59 29.9835 33.5362 30.005 33.4774C30.0266 33.4185 30.0359 33.3559 30.0324 33.2934C30.0219 33.1726 29.9659 33.0603 29.8758 32.9793C29.7856 32.8984 29.668 32.8548 29.5469 32.8574Z" fill="currentColor"/><path d="M0.64126 32.8575H2.26581V6.67557L0.263856 4.66725C0.21842 4.62238 0.182351 4.56893 0.157728 4.51C0.133105 4.45106 0.120422 4.38783 0.120422 4.32395C0.120422 4.26008 0.133105 4.19684 0.157728 4.13791C0.182351 4.07897 0.21842 4.02552 0.263856 3.98065V3.98065C0.308578 3.93498 0.361967 3.89869 0.42088 3.87392C0.479793 3.84915 0.543046 3.8364 0.606949 3.8364C0.670851 3.8364 0.734115 3.84915 0.793028 3.87392C0.851941 3.89869 0.905319 3.93498 0.950041 3.98065L6.79291 9.83909C6.83273 9.87865 6.86432 9.92572 6.88581 9.97758C6.90731 10.0294 6.9183 10.0851 6.91815 10.1412V33.5544C6.91994 33.5847 6.91523 33.615 6.90436 33.6433C6.89348 33.6717 6.87668 33.6973 6.85507 33.7186C6.83346 33.7399 6.80755 33.7563 6.77908 33.7668C6.75061 33.7773 6.72023 33.7815 6.68999 33.7792H0.613817C0.551215 33.7793 0.489252 33.7666 0.431727 33.7419C0.374202 33.7172 0.322324 33.681 0.279279 33.6355C0.236233 33.5901 0.202922 33.5362 0.181391 33.4774C0.159861 33.4186 0.15057 33.356 0.154074 33.2935C0.164918 33.1725 0.221259 33.0602 0.311705 32.9793C0.402152 32.8984 0.519946 32.8548 0.64126 32.8575V32.8575Z" fill="currentColor"/><path d="M15.0945 18.1504L13.1354 16.1919C13.1055 16.1622 13.0674 16.1419 13.0259 16.1338C12.9845 16.1256 12.9416 16.1298 12.9026 16.146C12.8636 16.1621 12.8302 16.1894 12.8066 16.2244C12.783 16.2595 12.7703 16.3007 12.7701 16.3429V33.5664C12.77 33.5945 12.7756 33.6223 12.7864 33.6482C12.7972 33.6742 12.813 33.6977 12.833 33.7175C12.8529 33.7373 12.8765 33.7529 12.9026 33.7635C12.9286 33.7741 12.9564 33.7795 12.9845 33.7792H17.2028C17.2309 33.7795 17.2587 33.7741 17.2847 33.7635C17.3107 33.7529 17.3344 33.7373 17.3543 33.7175C17.3743 33.6977 17.3901 33.6742 17.4009 33.6482C17.4117 33.6223 17.4172 33.5945 17.4172 33.5664V16.3395C17.417 16.2973 17.4043 16.256 17.3807 16.221C17.3571 16.186 17.3237 16.1587 17.2847 16.1425C17.2457 16.1264 17.2028 16.1222 17.1613 16.1303C17.1199 16.1385 17.0818 16.1587 17.0518 16.1885L15.0945 18.1504Z" fill="currentColor"/><path d="M15.0928 7.70372C17.2188 7.70372 18.9423 5.97919 18.9423 3.85188C18.9423 1.72456 17.2188 3.05176e-05 15.0928 3.05176e-05C12.9667 3.05176e-05 11.2433 1.72456 11.2433 3.85188C11.2433 5.97919 12.9667 7.70372 15.0928 7.70372Z" fill="currentColor"/></g><defs><clipPath id="c0m"><rect width="138.245" height="16.907" fill="white" transform="translate(44.7555 10.9402)"/></clipPath><clipPath id="c1m"><rect width="30.1922" height="33.8152" fill="white"/></clipPath></defs></svg>`;

const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
  plus: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
  check: '<path d="M4 12.5 9 17 20 6"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
  alert: '<path d="M12 3 2.5 20h19z"/><path d="M12 9v5M12 17h.01"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  chevleft: '<path d="m14 6-6 6 6 6"/>',
  expand: '<path d="m9 6 6 6-6 6"/><path d="M20 5v14"/>'
};
const icon = (name, cls) => '<svg class="' + (cls || 'ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.list) + '</svg>';

const STYLE = `
:host{
  --w-full:248px; --w-rail:60px; --inset:14px;
  --sb-bg:var(--surface,#fff); --sb-line:var(--line,#e3ebf4); --sb-text:var(--ink,#243b56); --sb-muted:var(--muted,#7b8fa3);
  --sb-mark:var(--mark,transparent); --sb-ink:var(--navy,#16385c); --sb-accent:var(--brand,#2362B4); --sb-accent-soft:var(--brand-soft,#eaf3ff); --sb-hover:var(--page,#f4f8fc); --sb-amber:var(--alumni,#EBB22A);
  --dur:220ms; --ease:cubic-bezier(.2,.9,.2,1);
  --sb-font:"Narkiss Block","Segoe UI",system-ui,sans-serif;
  display:block; width:var(--w-full); height:100vh; flex:none; position:sticky; top:0; align-self:flex-start; z-index:5;
  font-family:var(--sb-font); color:var(--sb-text);
}
:host([rail]){width:var(--w-rail)}
@media (prefers-reduced-motion:no-preference){:host{transition:width var(--dur) var(--ease) 40ms}}
*{box-sizing:border-box}
.panel{height:100vh;display:flex;flex-direction:column;background:var(--sb-bg);border-right:1px solid var(--sb-line)}
.brand{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:9px;height:92px;padding:0 22px;border-bottom:1px solid var(--sb-line);flex:none}
.brand .hub{position:relative;font-size:10.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--sb-muted);padding-bottom:6px;white-space:nowrap}
.brand .hub::after{content:"";position:absolute;left:0;bottom:0;height:2px;width:22px;border-radius:1px;background:var(--sb-mark,var(--sb-accent))}
:host([rail]) .brand .hub{display:none}
@media (prefers-reduced-motion:no-preference){
.brand .hub.in{animation:hubin .9s cubic-bezier(.2,.8,.2,1) both .15s}
.brand .hub.in::after{animation:hubline .6s cubic-bezier(.2,.8,.2,1) both .75s}
@keyframes hubin{from{opacity:0;letter-spacing:.42em;transform:translateY(4px)}to{opacity:1;letter-spacing:.18em;transform:none}}
@keyframes hubline{from{width:0}to{width:22px}}
}
.brand .logo{height:26px;width:auto;color:var(--sb-accent);display:block}
.brand .logo path{fill:currentColor}
.brand .mark{display:none;height:26px;width:auto;color:var(--sb-accent)}
.brand .mark path{fill:currentColor}
:host([rail]) .brand{justify-content:center;align-items:center;padding:0;gap:0}
:host([rail]) .brand .logo{display:none}
:host([rail]) .brand .mark{display:block}
.edge{position:absolute;top:33px;right:-13px;z-index:7;width:26px;height:26px;border-radius:50%;border:1px solid var(--line,#E3EAF2);background:#fff;color:#6B7B8C;display:grid;place-items:center;cursor:pointer;box-shadow:0 1px 3px rgba(22,56,92,.12);padding:0}
.edge:hover{color:#2362B4;border-color:#2362B4;box-shadow:0 2px 8px rgba(35,98,180,.22)}
.edge .ic{width:14px;height:14px;stroke-width:2.4}
@media (prefers-reduced-motion:no-preference){.edge .ic{transition:rotate 200ms var(--ease)}}
:host([rail]) .edge .ic{rotate:180deg}
.scroll{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;padding:22px 10px 16px}
.scroll::-webkit-scrollbar{display:none}
nav{position:relative}
.indicator{position:absolute;left:0;top:0;width:0;height:0;border-radius:10px;background:var(--sb-accent-soft);border:1px solid transparent;border-left:3px solid var(--sb-mark,transparent);box-shadow:none;pointer-events:none;z-index:0;translate:var(--x,0) var(--y,0);opacity:0}
.indicator.on{opacity:1}
@media (prefers-reduced-motion:no-preference){.indicator.glide{transition:translate 200ms cubic-bezier(.5,0,.1,1),width 200ms var(--ease),height 200ms var(--ease)}}
.section+.section{margin-top:24px}
.eyebrow{display:flex;align-items:center;height:28px;margin-bottom:6px;padding:0 var(--inset);font-size:10.5px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--sb-muted);opacity:.85;white-space:nowrap}
:host([rail]) .eyebrow{display:none}
:host([rail]) .section+.section{margin-top:6px;padding-top:6px;border-top:1px solid var(--sb-line)}
.item{position:relative;z-index:1;display:flex;align-items:center;gap:14px;width:100%;height:44px;margin:4px 0;padding:0 var(--inset);border:0;background:none;border-radius:11px;color:var(--sb-muted);font:inherit;font-size:14px;font-weight:500;text-align:left;cursor:pointer;white-space:nowrap}
.item:hover{background:var(--sb-hover);color:var(--sb-text)}
.item[aria-current="page"]{color:var(--sb-accent);font-weight:500;padding-left:calc(var(--inset) + 3px)}
.item[aria-current="page"]:hover{background:none}
.item .ic{width:18px;height:18px;flex:none;color:currentColor;opacity:.85}
.item .label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}
.item .count{margin-left:auto;min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:var(--sb-hover);color:var(--sb-text);font-size:11px;font-weight:500;display:inline-flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums}
.item .count.urgent{background:var(--sb-amber);color:#3F2C00}
:host([rail]) .item{width:44px;height:44px;padding:0;justify-content:center;margin:4px auto}
:host([rail]) .item .label,:host([rail]) .item .count{display:none}
:host([rail]) .item.has-count::after{content:"";position:absolute;top:7px;right:7px;width:7px;height:7px;border-radius:50%;background:var(--sb-amber);border:1.5px solid var(--sb-bg)}
:host([rail]) .sub{display:none}
.tip{position:fixed;z-index:60;display:flex;align-items:center;gap:8px;height:32px;padding:0 10px 0 12px;background:var(--sb-ink,#16385c);color:#fff;font:inherit;font-size:13px;font-weight:500;border-radius:8px;white-space:nowrap;box-shadow:0 6px 18px rgba(22,56,92,.18);pointer-events:none;opacity:0;translate:-4px 0}
.tip.on{opacity:1;translate:0 0}
@media (prefers-reduced-motion:no-preference){.tip{transition:opacity 120ms ease,translate 120ms ease}}
.tip::before{content:"";position:absolute;left:-5px;top:50%;width:10px;height:10px;background:inherit;rotate:45deg;translate:0 -50%;border-radius:2px}
.tip .count{min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:rgba(255,255,255,.18);font-size:11px;font-weight:500;display:inline-flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums}
.tip .count.urgent{background:var(--sb-amber);color:#3F2C00}
.foot{flex:none;border-top:1px solid var(--sb-line);padding:14px 10px}
.prog{position:relative;overflow:hidden;display:flex;align-items:center;gap:12px;padding:14px 14px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.prog .mk{display:block;width:22px;height:25px;color:#fff;flex:none}
.prog .mk svg,.prog .wm svg{display:block;width:100%;height:100%}
.prog .mk svg path,.prog .wm svg path{fill:currentColor}
.prog .tx{display:flex;flex-direction:column;gap:3px;min-width:0}
.prog .ey{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--sb-muted);white-space:nowrap}
.prog b{font-size:12px;font-weight:500;color:var(--sb-text);line-height:1.3;white-space:nowrap}
.prog .wm{position:absolute;right:-18px;bottom:-22px;width:86px;height:96px;color:#fff;opacity:.05;pointer-events:none}
:host([rail]) .foot{display:none}
.who{display:flex;align-items:center;gap:12px;padding:4px var(--inset);white-space:nowrap}
.who .av{width:34px;height:34px;border-radius:50%;background:var(--who,var(--sb-mark,var(--sb-accent-soft)));color:var(--who-ink,#0B2A3F);display:grid;place-items:center;font-size:12px;font-weight:500;flex:none}
.who b{display:block;font-size:13px;font-weight:500;color:var(--sb-text)}
.who span{display:block;font-size:12px;color:var(--sb-muted)}
:host([rail]) .who{justify-content:center;padding:4px 0}
:host([rail]) .who div{display:none}
:focus-visible{outline:2px solid var(--sb-accent);outline-offset:2px}
@media (max-width:900px){.edge{display:none}:host,:host([rail]){width:var(--w-full)}}
`;

class MoshalSidebar extends HTMLElement {
  static get observedAttributes(){ return ['active', 'sections', 'rail']; }
  intro(){ const h = this.shadowRoot && this.shadowRoot.querySelector('.brand .hub'); if (!h) return; h.classList.remove('in'); void h.offsetWidth; h.classList.add('in'); }

  spark(){
    return '<div class="prog"><span class="mk" aria-hidden="true">' + LOGO_MARK + '</span><span class="tx"><span class="ey">Moshal Program</span><b>From campus to career</b></span><span class="wm" aria-hidden="true">' + LOGO_MARK + '</span></div>';
  }

  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this._sections = [];
    this._placed = false;
    this._onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b'){ e.preventDefault(); this.toggle(); } if (e.key === 'Escape') this.closeFlyout(); };
    this._onDoc = () => this.closeFlyout();
  }
  connectedCallback(){
    try { if (localStorage.getItem('moshal.sidebar') === 'rail') this.setAttribute('rail', ''); } catch (e) {}
    this.render();
    document.addEventListener('keydown', this._onKey);
    document.addEventListener('click', this._onDoc);
    this._ro = new ResizeObserver(() => this.aim(false));
    this._ro.observe(this.shadowRoot.querySelector('nav'));
    this.addEventListener('transitionend', (e) => { if (e.propertyName === 'width') this.aim(true); });
  }
  disconnectedCallback(){ document.removeEventListener('keydown', this._onKey); document.removeEventListener('click', this._onDoc); this._ro && this._ro.disconnect(); }
  attributeChangedCallback(name){
    if (!this.shadowRoot || !this.shadowRoot.querySelector('nav')) return;
    if (name === 'sections') this.render(); else if (name === 'active') this.syncActive(); else if (name === 'rail') { this.closeFlyout(); this.syncActive(); }
  }
  get sections(){ try { return JSON.parse(this.getAttribute('sections') || '[]'); } catch (e) { return []; } }
  get rail(){ return this.hasAttribute('rail'); }
  toggle(){
    if (this.rail) this.removeAttribute('rail'); else this.setAttribute('rail', '');
    const e = this.shadowRoot.querySelector('.edge'); if (e) { e.setAttribute('aria-label', this.rail ? 'Expand sidebar' : 'Collapse sidebar'); e.title = this.rail ? 'Expand (Ctrl B)' : 'Collapse (Ctrl B)'; }
    try { localStorage.setItem('moshal.sidebar', this.rail ? 'rail' : 'full'); } catch (e) {}
    this.dispatchEvent(new CustomEvent('modechange', {detail:{rail:this.rail}, bubbles:true}));
  }
  render(){
    const active = this.getAttribute('active');
    const sections = this.sections;
    this.shadowRoot.innerHTML = '<style>' + STYLE + '</style><div class="panel">' +
      '<button class="edge" type="button" aria-label="Collapse sidebar" title="Collapse (Ctrl B)">' + icon('chevleft') + '</button>' +
      '<div class="brand">' + LOGO_FULL + LOGO_MARK + '<span class="hub' + (this._painted ? '' : ' in') + '">Careers Hub</span></div>' +
      '<div class="scroll"><nav aria-label="Main"><span class="indicator" aria-hidden="true"></span>' +
      sections.map(s => '<div class="section" data-id="' + s.id + '"><div class="eyebrow">' + s.label + '</div>' +
        s.items.map((it, i) => '<button class="item' + (it.count ? ' has-count' : '') + '" data-key="' + it.key + '" data-section="' + s.id + '" data-first="' + (i === 0) + '"' + (it.key === active ? ' aria-current="page"' : '') + '>' +
          icon(it.icon) + '<span class="label">' + it.label + '</span>' + (it.count ? '<span class="count' + (it.urgent ? ' urgent' : '') + '">' + it.count + '</span>' : '') + '</button>').join('') +
        '</div>').join('') + '</nav></div>' +
      '<div class="foot">' + this.spark() + '</div></div>';
    if (this.getBoundingClientRect().width > 0) this._painted = true;
    const root = this.shadowRoot;
    root.querySelectorAll('.edge').forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); this.toggle(); }));
    root.querySelectorAll('.item').forEach(b => {
      b.addEventListener('click', (e) => { e.stopPropagation(); this.closeFlyout(); this.dispatchEvent(new CustomEvent('navigate', {detail:{key:b.dataset.key}, bubbles:true})); });
      b.addEventListener('pointerenter', () => { if (this.rail) this.showTip(b); });
      b.addEventListener('pointerleave', () => this.closeFlyout());
      b.addEventListener('focus', () => { if (this.rail) this.showTip(b); });
      b.addEventListener('blur', () => this.closeFlyout());
    });
    this._placed = false;
    requestAnimationFrame(() => this.aim(false));
  }
  syncActive(){
    const active = this.getAttribute('active');
    this.shadowRoot.querySelectorAll('.item').forEach(b => { if (b.dataset.key === active) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    this.aim(true);
  }
  /* The one card glides to the active row; in rail mode it sits on the section's first tile when the active row is hidden. */
  aim(animate){
    const nav = this.shadowRoot.querySelector('nav'), ind = this.shadowRoot.querySelector('.indicator');
    if (!nav || !ind) return;
    let target = nav.querySelector('.item[aria-current="page"]');
    if (!target) { ind.classList.remove('on'); return; }
    ind.classList.toggle('glide', animate && this._placed);
    ind.style.setProperty('--x', target.offsetLeft + 'px');
    ind.style.setProperty('--y', target.offsetTop + 'px');
    ind.style.width = target.offsetWidth + 'px';
    ind.style.height = target.offsetHeight + 'px';
    ind.classList.add('on');
    this._placed = true;
  }
  /* Rail mode: a tooltip for the icon under the pointer, nothing more. */
  showTip(btn){
    this.closeFlyout();
    const it = this.sections.flatMap(s => s.items).find(x => x.key === btn.dataset.key);
    if (!it) return;
    const tip = document.createElement('div');
    tip.className = 'tip';
    tip.setAttribute('role', 'tooltip');
    tip.innerHTML = '<span>' + it.label + '</span>' + (it.count ? '<span class="count' + (it.urgent ? ' urgent' : '') + '">' + it.count + '</span>' : '');
    const r = btn.getBoundingClientRect();
    tip.style.left = (r.right + 12) + 'px';
    tip.style.top = (r.top + r.height / 2 - 16) + 'px';
    this.shadowRoot.querySelector('.panel').appendChild(tip);
    requestAnimationFrame(() => tip.classList.add('on'));
    this._fly = tip;
  }
  closeFlyout(){ clearTimeout(this._leaveTimer); if (this._fly) { this._fly.remove(); this._fly = null; } }
}
customElements.define('moshal-sidebar', MoshalSidebar);
