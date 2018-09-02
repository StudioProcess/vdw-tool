import gulp from "gulp";
import gzip from "gulp-gzip";

gulp.task("gzipDist", () => {
	gulp.src("./dist/**/*")
	.pipe(gzip({
		append: false
	}))
	.pipe(gulp.dest("./dist"));
});
