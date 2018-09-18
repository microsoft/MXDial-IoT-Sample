# MXDial IoT DevKit Sample

In this PaaS demo solution you will setup and connect an Azure IoT DevKit device to the Azure IoT Hub and view sensor readings in a custom web application. The purpose of the demo is to showcase how the Azure IoT Hub is able to process messages in real-time from tangible devices. The demo also covers communicating to the device via Direct Methods and integrating to 3rd party API’s.

This repository contains a step-by-step guide on how to deploy your own instance of the demo. 

## Introduction

The source code in this repository contains the following:
* React Frontend Web Application
* .NET WebApi
* C++ Arduino Project

This tutorial will focus on setting up the required Azure services and consuming them within each of the applications to create an e2e solution that is focussed around the Azure IoT Hub. The below image outlines the high-level architecture of the solution.

![](https://devkitfiles.blob.core.windows.net/github/paas-arch.png)

## Environment Setup
### Prerequisites 
* Windows 10
* MXChip IoT DevKit AZ3166 ([Link](http://mxchip.com/az3166)).
* Visual Studio 2017 (Community/Professional/Enterprise) or later ([Link](https://visualstudio.microsoft.com/)).
* Visual Studio Code (If you don't have this already, you will install it as part of the `Install IoT DevKit Environment` step, later in the guide).
* Azure subscription ([Link](https://azure.microsoft.com/en-us/free/)).
* Twitter account ([Link](https://twitter.com/i/flow/signup)).
* Yarn Package Manager ([Link](https://yarnpkg.com/en/docs/install#windows-stable)).

All additional software that is required will be installed via the Install IoT DevKit Environment step later in the guide.

### Download Demo Material

If you have git installed, you can run the following command: `git clone https://github.com/Microsoft/MXDial-IoT-Sample.git`

Alternatively, you can download the material directly: [Download Material](https://github.com/Microsoft/MXDial-IoT-Sample/archive/master.zip)

### Install IoT DevKit Environment

 To install the DevKit environment, follow the [Install Development Environment](https://microsoft.github.io/azure-iot-developer-kit/docs/get-started/#install-development-environment) online guide. 


## Cloud Resources Setup

> NOTE: If you would like to setup the Azure resouces (next 3 steps) via ARM template, it is located at `./resources/mx-demo.json`. 

> NOTE: Throughout this setup you will be asked to add `<your intials>` as a way of uniquely identifying the resource you are creating. In the unlikely event the resource name has been taken, just add another random letter until it becomes unique.

### Create Azure Web App

The Azure App Service is an integrated offering for building and hosting web apps.

1. From the Azure Portal, go to the **Create a resource** option.
1. Search for `Web App`.
1. Select the first result and click the **Create** button.
1. Provide the required information:
    * App name: `mxchip-<your initials>`.
    * Create a new resource group with the name: `mxchip-demo-<your initials>`.
    * OS: Windows.
1. Click on App service plan/Location.
1. Click **Create** New.
1. Provide the required information:
    * App Service plan name: `mxchip-demo-<your initials>`.
    * Location: `West US`.
    * Pricing Tier: S1 Standard.
1. Click **OK** to save the new App service plan.
1. Click **Create** to deploy the service. This step might take a few moments.

### Create an Azure IoT Hub

1. From the Azure Portal, go to the **Create a resource** option.
1. Search for `IoT Hub`.
1. Select the first result and click the **Create** button.
1. Provide the required information:
    * Subscription: select your subscription.
    * Select the resource group previously created: `mxchip-demo-<your initials>`.
    * Region: `West US`.
    * Name: `mxhub-<yourinitials>`.
1. Click on *Next: Size and scale*.
    * Pricing and scale tier: select F1(Free tier) if available, otherwise select S1(Standard).
1. Click on **Review + create**.
1. Review your IoT hub information, then click **Create**. This process might take a few moments.

### Add a Consumer Group to your Azure IoT Hub

To add a consumer group to your IoT hub, follow these steps:

1. In the Azure portal, go to **All Resources** in the left pane and **search** for your IoT Hub: `mxhub-<yourinitials>`.
1. **Click** on the resource to open it.
1. In the left pane, click **Endpoints**, select **Events** on the middle pane, look for the Consumer groups on the right pane.
1. Add a new consumer group with the name `mxchip` and then click **Save**.

### Get the IoT Hub Connection String 

1. Open your IoT Hub resource in Azure.
1. In the left pane, click **Shared access policies** and select **iothubowner** on the middle pane.
1. Copy the value of **Connection string—primary key** into Notepad as you will need it later.

### Twitter Setup

> NOTE: Twitter have recently updated how they manage developer accounts and they are need to be approved first. It is important to note that this can take some time and you will not be able to use Twitter integration until this process is completed. As a workaround - Leave the placeholder values in the `web.config` updates later in the lab. The integration will fail gracefully until you update the values and re-publish your Azure Web Application. 


Create a Twitter App and get the following settings:
1. Apply for a [Twitter developer account](https://developer.twitter.com/en/apply/user) and wait for approval.
2. Once approved, you will be able to create new apps from [developer.twitter.com](https://developer.twitter.com/).
3. Create a new App and provide the application details.
  > NOTE: you can skip the callback url as we won't be using authentication.
  > NOTE: Follow [this link](https://developer.twitter.com/en/docs/basics/developer-portal/guides/apps) to get more information about creating Twitter Apps.
4. Get the following information from the **Keys and Access Tokens** tab:
    * Consumer Key (API Key)
    * Consumer Secret (API Secret)
    * Access token (create a new one with `Read and Write` access.)
    * Access token secret
  > NOTE: Copy these values into Notepad as you will need them later.

## Deploying the Web Application

### Update App Settings

1. Open **Visual Studio 2017** and open the **Web.config** file which is located in the following location `.\MXDial-IoT-Sample\backend\MXApi\Web.config`.
1. Add the connection string for the IoT Hub:
    * IoTHubConnectionString: `<your IoT Hub connection string>`
1. Use the information previously obtained to complete the settings that will be used to connect to your twitter:
    * TwitterAccountUrl: `https://twitter.com/<your_account_name>`
    * TwitterConsumerKey: `<your twitter consumer key>`
    * TwitterConsumerSecret: `<your twitter consumer secret>`
    * TwitterAccessToken: `<your twitter access token>`
    * TwitterAccessTokenSecret: `<your twitter access token secret>`

> NOTE: We recommend leaving all over settings as the default value.

### Build the Frontend

1. Open a **Command Prompt** window and navigate to `frontend/mx`.
1. Run the following commands to output the frontend to a build directory:
    * yarn install
    * yarn build
1. Create a **wwwroot** directory in `backend/MXApi` folder.
1. Copy the contents of the **build** directory to `backend/MXApi/wwwroot`

### Deploy to Azure from Visual Studio

For the purposes of our demo, we'll be deploying directly from Visual Studio.

1. Open **Visual Studio 2017** from the Start Menu.
2. Click **Open Project/Solution** and select `backend\MxDialBackend.sln`.
3. Check your current connected account in the top right corner of Visual Studio.
  > NOTE: Ensure you are signed in with the same credentials you used to sign in to Azure. This will connect Visual Studio to your Azure subscription.
4. Right-click the MxApi project.
5. Click **Publish**.
6. Mark the option Select Existing.
7. Click **Publish**.
8. Select the Web App previously created.
9. Click **OK** and wait for the deployment to complete. This step might take a few minutes.

## Deploying the Arduino Solution to the DevKit Device.

> NOTE: Please ensure your MX Chip has the latest firmware. You can follow the instructions here: [Firmware Upgrade](https://microsoft.github.io/azure-iot-developer-kit/docs/firmware-upgrading/).

### Connect to WiFi
1. Connect the Micro-USB end to the IoT DevKit.
1. Connect the USB end to your computer.
1. The green LED for power confirms the connection.

![](https://devkitfiles.blob.core.windows.net/github/wifi-2.jpg)

4. Hold down button B, push and release the reset button, and then release button B. Your IoT DevKit enters AP mode for configuring the Wi-Fi connection. The screen displays the service set identifier (SSID) of the IoT DevKit and the configuration portal IP address:

<p align="center">
  <img src="https://devkitfiles.blob.core.windows.net/github/wifi-3.jpg"/>
</p>

5. Use a Web browser on a different Wi-Fi enabled device (computer or mobile phone) to connect to the IoT DevKit SSID displayed in the previous step. If it asks for a password, leave it empty.

![](https://devkitfiles.blob.core.windows.net/github/wifi-4.jpg)

6. Open 192.168.0.1 in the browser. Select the Wi-Fi network that you want the IoT DevKit to connect to, type the password for the Wi-Fi conection, and then click Connect.

![](https://devkitfiles.blob.core.windows.net/github/wifi-5.jpg)

7. The IoT DevKit reboots in a few seconds. You then see the Wi-Fi name and assigned IP.

<p align="center">
  <img src="https://devkitfiles.blob.core.windows.net/github/wifi-6.jpg"/>
</p>

### Update the DevKit Solution

1. Open VS Code then select `File > Open Workspace`.
2. Navigate to the `mxdevice` directory from the source code and open the `project` Workspace.
3. Open `config.h` and replace `<Web App URL>` with the Web App URL you created earlier. It should look like: `https://mxchip-<yourinitials>.azurewebsites.net/api/mx/device-credentials/`
> NOTE: If you don’t have Arduino extension in VS Code installed, click the Install in the notification pane if prompted. If you modified your password in the web.config, you will need to convert it to Base64.
4. Save your project. Don't close it as you will need it for the next section.

### Deploy Code to your DevKit Device
1. Ensure your DevKit is connected to your Windows machine and the `project` Workspace is open. If the IoT Workbench Examples window opens, you can close it.
2. Ensure you have the correct COM port selected. The correct port will have `STMicroelectronics` beside it.

![](https://devkitfiles.blob.core.windows.net/github/select-board.png)

3. Press `F1` on your keyboard.
4. Search for `IoT Workbench: Device` and select.
5. From the Device Menu, select `Device Upload`.
6. The code will compile and deploy to your device. Follow any prompts from the console if required. 


## Testing the Solution
1. Plug in your device and get your Device ID from the mini display. It will be 6 characters.

<p align="center">
  <img src="https://devkitfiles.blob.core.windows.net/github/chip-id.png"/>
</p>

2. Open your Web App in a new browser window. It should look like `https://mxchip-<yourinitials>.azurewebsites.net`
3. The web site will request credentials to access, use the following:
    * Username: `<Your 6 digit Device ID>`
    * Password: `Azure`.
  > NOTE: Make sure that your device is on, otherwise you won't see anything in the web page.
4. You should now see your device on your dashboard.

![](https://devkitfiles.blob.core.windows.net/github/complete-demo.png)

5. Your Twitter feed should look like the following.

![](https://devkitfiles.blob.core.windows.net/github/twitter.png)


# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
