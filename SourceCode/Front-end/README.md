
 HDSD

 #init
 npx create-react-app --template typescript
#lib
tailwindcss: https://tailwindcss.com/docs/installation
antd: https://ant.design/components/overview/

Getting Started with Create React App
This project was bootstrapped with Create React App.

Available Scripts
In the project directory, you can run:

npm start

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.
The page will reload if you make edits.
You will also see any lint errors in the console.

npm test

Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

npm run build

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
Your app is ready to be deployed!
See the section about deployment for more information.

npm run eject

Note: this is a one-way operation. Once you eject, you can’t go back!
If you aren’t satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.
Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except eject will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.
You don’t have to ever use eject. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

Learn More
You can learn more in the Create React App documentation.
To learn React, check out the React documentation.
#structures
└───public: chứa các statics file: ảnh, html, logo...
    └───img: chứa images

└───src
    ├───components: chứa các react components
    ├───containers: chứa các containers, container pages. VD: Calendar và phần events là 2 components, được viết
    thành một container nhằm mục đích tái sử dụng
        └───common
        └───Student
        └───Teacher
        └───Manager
    ├───hooks: chứa các hooks, custom hooks
    ├───layout: chứa layout của các pages, navber, sidebar, footer.
    ├───locales: các file ngôn ngữ, i18n
    ├───pages: chứa các pages, route sẽ được trỏ đến các pages này
        └───common
        └───Student
    └───Teacher
    └───Managetr
    ├───services: chứa các services, mục đích tách phần code services khỏi phần components nhằm thuận tiện bảo trì.
        VD: các api-services. API sẽ được tách ra ở trong thư mục này và import vào các components để sử dụng
└───styles:
    └───components: styles của components
    └───[*].css Chứa styles các pages, styles container...
├───types: định nghĩa các type của TS
├───error-codes: chứa các error code trả về. Định nghĩa error code để thống nhất trong việc return lỗi.
├───Router.tsx: định nghĩa các routes.

#extensions
Tailwind CSS IntelliSense: snippet for tailwind
