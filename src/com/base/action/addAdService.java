package com.base.action;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.base.dbconn.DBConnection;

@SuppressWarnings("serial")
public class addAdService extends HttpServlet {
	public String adName;
	public String own;
	public String adType;
	public String publishDate;
	public String expiryDate;
	public String directory;
	public String actionType;
	public InputStream fileStream;
	public String saveFilename;
	public String saveFilepath;
	public String adId;

	@SuppressWarnings({ "deprecation", "rawtypes" })
	public void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String result = "";
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html; charset=UTF-8");
		// 添加session
		 HttpSession session = ((HttpServletRequest) request).getSession();
		 HashMap userInfo = (HashMap) session.getAttribute("user_session");
		own = (String) userInfo.get("userId");
		// 1、创建一个DiskFileItemFactory工厂
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// 设置工厂的缓冲区的大小，当上传的文件大小超过缓冲区的大小时，就会生成一个临时文件存放到指定的临时目录当中。
		factory.setSizeThreshold(1024 * 100);// 设置缓冲区的大小为100kb，如果不指定，那么缓冲区的大小默认是10KB
		// 2、创建一个文件上传解析器
		ServletFileUpload upload = new ServletFileUpload(factory);
		// 解决上传文件名的中文乱码
		upload.setHeaderEncoding("UTF-8");
		// 设置上传单个文件的大小的最大值，目前是设置为1024*1024字节，也就是10MB
		upload.setFileSizeMax(1024 * 1024 * 10);
		// 设置上传文件总量的最大值，最大值=同时上传的多个文件的大小的最大值的和，目前设置为10MB
		upload.setSizeMax(1024 * 1024 * 10);
		// 4、使用ServletFileUpload解析器解析上传数据，解析结果返回的是一个List<FileItem>集合，每一个FileItem对应一个Form表单的输入项
		try {
			List<FileItem> list = upload.parseRequest(request);
			for (FileItem item : list) {
				// 如果fileitem中封装的是普通输入项的数据
				if (item.isFormField()) {
					getValue(item);
				} else {// 如果fileitem中封装的是上传文件
						// 得到上传的文件名称，
					String filename = item.getName();
					if (filename == null || filename.trim().equals("")) {
						continue;
					}
					System.out.println(filename);
					filename = filename
							.substring(filename.lastIndexOf("\\") + 1);
					// 得到上传文件的扩展名
					String fileExtName = filename.substring(filename
							.lastIndexOf("."));
					// 如果需要限制上传的文件类型，那么可以通过文件的扩展名来判断上传的文件类型是否合法
					System.out.println("上传的文件的扩展名是：" + fileExtName);
					// 得到文件保存的名称
					saveFilename = UUID.randomUUID().toString() + fileExtName;
					saveFilepath = request.getRealPath("/");
					fileStream = item.getInputStream();
				}
			}
			boolean rs = false;
			if (actionType != null && "add".equals(actionType)) {
				rs = insertAd();
			} else if (actionType != null && "edit".equals(actionType)) {
				rs = updateAd();
			}
			if (rs) {
				result = "{ \"result\":\"true\"}";
			} else {
				result = "{ \"result\":\"服务处理异常!\"}";
			}
		} catch (Exception e) {
			result = "{ \"result\":\"服务处理异常!\"}";
			e.printStackTrace();
		}
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		out.println(result);
		out.flush();
		out.close();
	}

	public void getValue(FileItem item) {
		String name = item.getFieldName();
		try {
			if (name != null && "adName".equals(name)) {
				adName = item.getString("UTF-8");
			}
			if (name != null && "adType".equals(name)) {
				adType = item.getString("UTF-8");
			}
			if (name != null && "publishDate".equals(name)) {
				publishDate = item.getString("UTF-8");
			}
			if (name != null && "expiryDate".equals(name)) {
				expiryDate = item.getString("UTF-8");
			}
			if (name != null && "directory".equals(name)) {
				directory = item.getString("UTF-8");
			}
			if (name != null && "actionType".equals(name)) {
				actionType = item.getString("UTF-8");
			}
			if (name != null && "adId".equals(name)) {
				adId = item.getString("UTF-8");
			}
			System.out.println("name------"+name+";value------"+item.getString("UTF-8"));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}

	public void writeFile() {
		try {
			String filepath = saveFilepath + directory + "\\" + saveFilename;
			File file = new File(saveFilepath + directory);
			if (!file.exists() && !file.isDirectory()) {
				System.out.println(saveFilepath + directory + "目录不存在，需要创建");
				// 创建目录
				file.mkdir();
			}
			// 获取item中的上传文件的输入流
			FileOutputStream out = new FileOutputStream(filepath);
			// 创建一个缓冲区
			byte buffer[] = new byte[1024];
			// 判断输入流中的数据是否已经读完的标识
			int len = 0;
			// 循环将输入流读入到缓冲区当中，(len=in.read(buffer))>0就表示in里面还有数据
			while ((len = fileStream.read(buffer)) > 0) {
				// 使用FileOutputStream输出流将缓冲区的数据写入到指定的目录(savePath + "\\"
				// + filename)当中
				out.write(buffer, 0, len);
			}
			// 关闭输入流
			fileStream.close();
			// 关闭输出流
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void deleteFile(String path) {
		File file = new File(path);
		if (file.exists() && !file.isDirectory()) {
			file.delete();
		}
	}

	public boolean insertAd() {
		writeFile();
		String filepath = directory + "/" + saveFilename;
		DBConnection db = new DBConnection();
		String sql = "insert into adinfo (adName,content,ownerId,adType,publishDate,expiryDate) values('"
				+ adName
				+ "','"
				+ filepath
				+ "','"
				+ own
				+ "','"
				+ adType
				+ "','" + publishDate + "','" + expiryDate + "')";
		return db.doExecute(sql);
	}

	@SuppressWarnings("rawtypes")
	public boolean updateAd() {
		DBConnection db = new DBConnection();
		ArrayList<HashMap> list = db.doQueryData("select content from adinfo where adId = '" + adId+ "'");
		String path = (String) list.get(0).get("content");
		deleteFile(saveFilepath + "/" + path);
		String sql = "";
		if(saveFilename != "" && !"".equals(saveFilename) && saveFilename != null && !"null".equals(saveFilename)){
			writeFile();
			String filepath = directory + "/" + saveFilename;
			sql = "update adinfo set adName = '"+adName+ "',content = '"+filepath+"',ownerId = '"+own+"',adType = '"+adType+"',publishDate = '" + publishDate + "',expiryDate = '" + expiryDate + "' where adId = '"+adId+"'";
		}else{
			sql = "update adinfo set adName = '"+adName+ "',ownerId = '"+own+"',adType = '"+adType+"',publishDate = '" + publishDate + "',expiryDate = '" + expiryDate + "' where adId = '"+adId+"'";
		}
		return db.doExecute(sql);
	}
}
