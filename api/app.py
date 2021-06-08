from flask import Flask, render_template , request , jsonify
import os , io , sys
import numpy as np 
import cv2
import base64
from PIL import Image
import os
from options.test_options import TestOptions
from data import create_dataset
from models import create_model
from util.visualizer import save_images
from util import html
from options.base_options import BaseOptions
app = Flask(__name__)

############################################## THE REAL DEAL ###############################################
@app.route('/maskImage' , methods=['GET','POST'])
def mask_image():
	#print(request.data)
	# print(request.files , file=sys.stderr)
	modelnum = int(str(request.data)[2])
	floornum = str(request.data)[3]
	print(modelnum,floornum)
	img = request.data[24:] ## byte file
	# print(img)
	im = Image.open(io.BytesIO(base64.b64decode(img)))
	#npimg = np.fromstring(file, np.uint8)
	im.save('./datasets/test/10111.png', 'PNG')
	im = cv2.imread('./datasets/test/10111.png')
	width=256
	height=256
	dim=(width,height)
	resized = cv2.resize(im, dim, interpolation = cv2.INTER_AREA)
	cv2.imwrite('./datasets/test/10111.png',resized)
	whiteblankimage = 255 * np.ones(shape=[256, 256, 3], dtype=np.uint8)
	cv2.imwrite("White.png", whiteblankimage)
	image1 = Image.open("./datasets/test/10111.png")
	image2 = Image.open("White.png")
	new_img = Image.new('RGB', (512, 256))
	new_img.paste(image1, (0,0))
	new_img.paste(image2, (256,0))
	new_img.save('./datasets/test/10111.png')
	#img = cv2.imdecode(npimg,cv2.IMREAD_COLOR)
	######### Do preprocessing here ################
	# img[img > 150] = 0
	## any random stuff do here
	
	if(modelnum==1 and floornum=="G"):
		os.system("python3 test.py --dataroot ./datasets --direction AtoB --model pix2pix --name ground_1")
		with open("./results/ground_1/test_latest/images/10111_fake_B.png", "rb") as img_file:
			img = base64.b64encode(img_file.read())
		# return jsonify({"image":b64_string})
	elif(modelnum==2 and floornum=="G"):
		os.system("python3 test.py --dataroot ./datasets --direction AtoB --model pix2pix --name ground_2")
		with open("./results/ground_2/test_latest/images/10111_fake_B.png", "rb") as img_file:
			img = base64.b64encode(img_file.read())
		# return jsonify({"image":b64_string})
	elif(modelnum==3 and floornum=="G"):
		os.system("python3 test.py --dataroot ./datasets --direction AtoB --model pix2pix --name ground_3")
		with open("./results/ground_3/test_latest/images/10111_fake_B.png", "rb") as img_file:
			img = base64.b64encode(img_file.read())
		# return jsonify({"image":b64_string})
	elif(modelnum==4 and floornum=="G"):
		os.system("python3 test.py --dataroot ./datasets --direction AtoB --model pix2pix --name ground_4")
		with open("./results/ground_4/test_latest/images/10111_fake_B.png", "rb") as img_file:
			img = base64.b64encode(img_file.read())
		# return jsonify({"image":b64_string})
	elif(modelnum==1 and floornum=="T"):
		os.system("python3 test.py --dataroot ./datasets --direction AtoB --model pix2pix --name top_1")
		with open("./results/top_1/test_latest/images/10111_fake_B.png", "rb") as img_file:
			img = base64.b64encode(img_file.read())
		# return jsonify({"image":b64_string})
	#test.py --dataroot ./datasets/1 --direction AtoB --model pix2pix --name plannit
	# else:
	else:
		img = img
	return jsonify({"image":img})


	################################################
	#img = Image.fromarray(img.astype("uint8"))
	#rawBytes = io.BytesIO()
	#img.save(rawBytes, "JPEG")
	#rawBytes.seek(0)
	#img_base64 = base64.b64encode(rawBytes.read())
	# return jsonify({'status':str(img_base64)})
	return jsonify({'status':"success"})

##################################################### THE REAL DEAL HAPPENS ABOVE ######################################

@app.route('/test' , methods=['GET','POST'])
def test():
	print("log: got at test" , file=sys.stderr)
	print(request.data)
	return jsonify({'status':'succces'})

# @app.route('/')
# def home():
# 	return render_template('index.jinja2')


	
@app.after_request
def after_request(response):
    print("log: setting cors" , file = sys.stderr)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


if __name__ == '__main__':
	app.run(debug = True)
